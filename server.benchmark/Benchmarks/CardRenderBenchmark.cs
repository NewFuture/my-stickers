using AdaptiveCards.Templating;
using BenchmarkDotNet.Attributes;
using Microsoft.Bot.Schema;
using Microsoft.Bot.Schema.Teams;
using Newtonsoft.Json.Linq;
using Stickers.Bot;
using Stickers.Models;
using Stickers.Utils;

namespace Benchmark;

public class CardRenderBenchmark
{
    private const int NUM = 25;
    private const int n = 10;
    private readonly List<Img> imgs;

    private static readonly Dictionary<string, AdaptiveCardTemplate> cardDict =
        new Dictionary<string, AdaptiveCardTemplate>();
    private const string CARD_NAME = "cards/card.json";
    private const string CARDLIST_NAME = "cards/list.json";

    public CardRenderBenchmark()
    {
        imgs = new List<Img>();
        for (int i = 0; i < NUM; i++)
        {
            imgs.Add(new Img() { Src = $"https://test.img/{i}", Alt = $"img-{i}" });
        }

        string cardPath = ResourceFilePathHelper.GetFilePath(CARD_NAME);
        var cardJsonString = File.ReadAllText(cardPath);
        cardDict.Add(CARD_NAME, new AdaptiveCardTemplate(cardJsonString));
        cardPath = ResourceFilePathHelper.GetFilePath(CARDLIST_NAME);
        cardJsonString = File.ReadAllText(cardPath);
        cardDict.Add(CARDLIST_NAME, new AdaptiveCardTemplate(cardJsonString));
    }

    [Benchmark(Baseline = true)]
    public MessagingExtensionResponse RenderFromCardOnly()
    {
        var result = GetMessagingExtensionResponse(imgs);
        for (int i = 0; i < n; i++)
        {
            result = GetMessagingExtensionResponse(imgs);
        }
        return result;
    }

    [Benchmark]
    public MessagingExtensionResponse RenderFromPureObject()
    {
        var result = GetMessagingExtensionResponseFromPureObject(imgs);
        for (int i = 0; i < n; i++)
        {
            result = GetMessagingExtensionResponseFromPureObject(imgs);
        }
        return result;
    }

    [Benchmark]
    public object RenderFromListTemplate()
    {
        var result = GetMessagingExtensionResponseFromTempate(imgs);
        for (int i = 0; i < n; i++)
        {
            result = GetMessagingExtensionResponseFromTempate(imgs);
        }
        return result;
    }

    public static MessagingExtensionResponse GetMessagingExtensionResponse(IEnumerable<Img> images)
    {
        List<MessagingExtensionAttachment> attachments = images
            .Select(
                img =>
                    new MessagingExtensionAttachment()
                    {
                        ContentType = "application/vnd.microsoft.card.adaptive",
                        Content = GetAdaptiveCardJsonObject(img, CARD_NAME),
                        Preview = new Attachment() { }
                    }
            )
            .ToList();

        return new MessagingExtensionResponse
        {
            ComposeExtension = new MessagingExtensionResult("grid", "result", attachments),
        };
    }

    public static MessagingExtensionResponse GetMessagingExtensionResponseFromPureObject(
        IEnumerable<Img> images
    )
    {
        List<MessagingExtensionAttachment> attachments = images
            .Select(
                img =>
                    new MessagingExtensionAttachment()
                    {
                        ContentType = "application/vnd.microsoft.card.adaptive",
                        Content = JObject.FromObject(
                            new
                            {
                                type = "AdaptiveCard",
                                version = "1.5",
                                minHeight = "150px",
                                verticalContentAlignment = "center",
                                body = new[]
                                {
                                    new
                                    {
                                        altText = img.Alt,
                                        horizontalAlignment = "center",
                                        url = img.Src,
                                        height = "auto",
                                        msTeams = new { allowExpand = true, },
                                        separator = false,
                                        type = "Image",
                                    }
                                }
                            }
                        ),
                        Preview = new ThumbnailCard()
                        {
                            Images = new List<CardImage>() { new CardImage(img.Src, img.Alt) }
                        }.ToAttachment()
                    }
            )
            .ToList();

        return new MessagingExtensionResponse
        {
            ComposeExtension = new MessagingExtensionResult("grid", "result", attachments),
        };
    }

    public static object GetMessagingExtensionResponseFromTempate(IEnumerable<Img> images)
    {
        var list = GetAdaptiveCardJsonObject(new { Imgs = images }, CARDLIST_NAME);
        return list.ToObject<object>();
    }

    private static JObject GetAdaptiveCardJsonObject(object cardPayload, string cardFileName)
    {
        if (!cardDict.TryGetValue(cardFileName, out var template))
        {
            throw new Exception($"{cardFileName} not found");
        }
        var cardJson = template.Expand(cardPayload);
        return JObject.Parse(cardJson);
    }
}
