namespace Stickers.Models;

public record class Result
{
    public bool result;

    public Result(bool result = true)
    {
        this.result = result;
    }
}
