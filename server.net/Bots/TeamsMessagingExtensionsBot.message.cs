// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
// @see https://github.com/microsoft/BotBuilder-Samples/blob/main/samples/csharp_dotnetcore/51.teams-messaging-extensions-action/Bots/TeamsMessagingExtensionsActionBot.cs

using AdaptiveCards.Templating;
using Microsoft.Bot.Builder;
using Microsoft.Bot.Builder.Teams;
using Microsoft.Bot.Schema;
using Microsoft.Bot.Schema.Teams;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using Stickers.Entities;
using Stickers.Models;
using Stickers.Resources;
using Stickers.Utils;
using System.Globalization;
using System.Text.RegularExpressions;

namespace Stickers.Bot
{

    public partial class TeamsMessagingExtensionsBot : TeamsActivityHandler
    {
        protected override async Task<MessagingExtensionActionResponse> OnTeamsMessagingExtensionFetchTaskAsync(ITurnContext<IInvokeActivity> turnContext, MessagingExtensionAction action, CancellationToken cancellationToken)
        {
            var value = (JObject)turnContext.Activity.Value;
            var payload = value?["messagePayload"].ToObject<JObject>();
            var body = payload?["body"].ToObject<JObject>();
            var userId = turnContext.Activity?.From?.AadObjectId;
            var content = body?["content"].ToString();
            List<MessagingExtensionAttachment> attachments = payload?["attachments"].ToObject<List<MessagingExtensionAttachment>>();
            var imgs = this.GetImages(content);
            foreach(var attachment in attachments)
            {
                imgs.AddRange(this.getImageFromAttachment(attachment));
            }
            var saveImgs = imgs.Count > 0;
            var entities = new List<Sticker>();
            foreach(var img in imgs)
            {
                entities.Add(new Sticker { src = img.Src, name = img.Alt, id = Guid.NewGuid() });
            }
            await this.stickerStorage.addUserStickers(userId, entities);
            JObject cardJson;
            if (saveImgs)
            {
                cardJson = this.GetAdaptiveCardJsonObject(new { Imgs = imgs }, "SaveCard.json");
            } else
            {
                cardJson = this.GetAdaptiveCardJsonObject(new { BlankText = LocalizationHelper.LookupString("collect_save_no_images_found", GetCultureInfoFromBotActivity(turnContext.Activity)) }, "BlankCard.json");
            }
            
            var a = new Microsoft.Bot.Schema.Attachment()
            {
                ContentType = "application/vnd.microsoft.card.adaptive",
                Content = cardJson,
            };
            return await Task.FromResult(new MessagingExtensionActionResponse() {
                Task = new TaskModuleContinueResponse
                {
                    Value = new TaskModuleTaskInfo()
                    {
                        Title = saveImgs ? LocalizationHelper.LookupString("collect_save_success", GetCultureInfoFromBotActivity(turnContext.Activity)) : LocalizationHelper.LookupString("collect_save_fail", GetCultureInfoFromBotActivity(turnContext.Activity)),
                        Height = saveImgs ? 300 : 60,
                        Width = 300,
                        Card = a,
                    },
                },
            });
        }

        private JObject GetAdaptiveCardJsonObject(object cardPayload, string cardFileName)
        {
            string cardPath = ResourceFilePathHelper.GetFilePath(Path.Combine("Cards", cardFileName));
            var cardJsonString = File.ReadAllText(cardPath);

            AdaptiveCardTemplate template = new AdaptiveCardTemplate(cardJsonString);
            var cardJson = template.Expand(cardPayload);
            return JObject.Parse(cardJson);
        }

        private static CultureInfo GetCultureInfoFromBotActivity(IActivity activity)
        {
            if (activity.Entities[0].Properties.TryGetValue("locale", out JToken locale))
            {
                return new CultureInfo(locale.ToString(), false);
            }
            else
            {
                return new CultureInfo("en-US", false);
            }
        }

        private List<Img> GetImages(string content)
        {
            List<Img> imgs = new List<Img>();
            Regex srcRegex = new Regex("<img[^>]+src=\"([^\"\\s]+)\"[^>]*>");
            Regex altRegex = new Regex("<img[^>]+alt=\"([^\"]+)\"[^>]*>");
            var result = srcRegex.Matches(content);
            foreach(Match match in result)
            {
                var alt = altRegex.Match(match.Groups[0].Value)?.Groups?[1].Value;
                imgs.Add(new Img { Src = match.Groups[1].Value, Alt = alt });
            };
            return imgs;
        }

        private List<Img> getImageFromAttachment(MessagingExtensionAttachment attachment)
        {
            List<Img> imgs = new List<Img>();
            Regex imageRegex = new Regex("^http(s?):\\/\\/.*\\.(?:jpg|gif|png)$");
            if (attachment.ContentType.StartsWith("image") || (attachment.ContentUrl != null && imageRegex.IsMatch(attachment.ContentUrl)))
            {
                imgs.Add(new Img { Src = attachment.ContentUrl });
            }
            if (attachment.ContentType == "application/vnd.microsoft.card.adaptive" || attachment.ContentType == "application/vnd.microsoft.card.hero")
            {
                if (attachment.Content == null)
                {
                    return imgs;
                }

                var content = (JObject)JsonConvert.DeserializeObject(attachment.Content.ToString());
                var body = content?["body"].ToObject<List<JObject>>();
                foreach(var item in body)
                {
                    if (item["type"].ToString() == "Image")
                    {
                        imgs.Add(new Img { Src = item["url"].ToString(), Alt = item["alt"] == null ? item["altText"].ToString() : item["alt"].ToString() });
                    }
                }
            }

            return imgs;
        }

    }
}