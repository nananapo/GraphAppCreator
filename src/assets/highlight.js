const SYNTAX_TAG = "GraphSyntaxHighLight";
const HIGHLIGHT_ESCAPE_START = "__HIGHLIGHT__START__";
const HIGHLIGHT_ESCAPE_END   = "__HIGHLIGHT__END__";

function highlight(text,highlightId,highlightStartTag,highlightEndTag)
{

    let resultText = "";

    /*
    READ_STRING : 文字列を読み込む
    READ_TAG_NAME : タグ名を読み込む
    READ_GRAPH_ID : グラフIDを読み込む
     */
    let mode = "READ_STRING";

    let depth = 0;

    let highlightDepth = -1;

    let tempText = "";

    for(let index = 0; index < text.length; index++)
    {
        let char = text[index];

        switch(char)
        {
            case '<':
                if(mode === "READ_STRING")
                {
                    tempText = char;
                    mode = "READ_TAG_NAME";
                }
                else if(mode === "READ_GRAPH_ID")
                {
                    tempText += char;
                }
                else if(mode === "READ_TAG_NAME")
                {
                    tempText += char;
                }
                break;
            case '>':
                if(mode === "READ_STRING")
                {
                    resultText += char;
                }
                else if(mode === "READ_TAG_NAME")
                {
                    if(tempText === "</"+SYNTAX_TAG)
                    {
                        mode = "READ_STRING";
                        depth--;

                        if(depth < 0)
                        {
                            throw new Error("Invalid Syntax");
                        }
                        else if(depth+1 === highlightDepth)
                        {
                            highlightDepth = -1;
                            resultText += HIGHLIGHT_ESCAPE_END;
                        }
                    }
                    else
                    {
                        mode = "READ_STRING";
                        resultText += tempText + char;
                    }
                    tempText = "";
                }
                else if (mode === "READ_GRAPH_ID")
                {
                    depth++;

                    if (tempText === highlightId)
                    {
                        resultText += HIGHLIGHT_ESCAPE_START;
                        highlightDepth = depth;
                    }

                    mode = "READ_STRING";
                    tempText = "";
                }
                break;
            case ' ':
                if(mode === "READ_STRING")
                {
                    resultText += char;
                }
                else if(mode === "READ_TAG_NAME")
                {
                    if(tempText === "<"+SYNTAX_TAG)
                    {
                        mode = "READ_GRAPH_ID";
                    }
                    else
                    {
                        mode = "READ_STRING";
                        resultText += tempText + char;
                    }
                    tempText = "";
                }
                else if(mode === "READ_GRAPH_ID")
                {
                    tempText += char;
                }
                break;
            default:
                if(mode === "READ_STRING")
                {
                    resultText += char;
                }
                else if(mode === "READ_TAG_NAME")
                {
                    tempText += char;
                }
                else if(mode === "READ_GRAPH_ID")
                {
                    tempText += char;
                }
                break;
        }
    }

    resultText = resultText.replace(new RegExp(HIGHLIGHT_ESCAPE_START,"g"),highlightStartTag);
    resultText = resultText.replace(new RegExp(HIGHLIGHT_ESCAPE_END,"g"),highlightEndTag);

    return resultText;
}

//export function
export default highlight;