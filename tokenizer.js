var TextTokenizer = {
    getWordDelimiters: [
        " ", "\n", "\t", ".", ",", "?", ":", ";", "!", "-", "/"
    ],
    getWords({fullText}){
        const wordTokens = [];
        if(fullText){
            let currentWord = "";
            let delimiter = "";
            fullText.split("").forEach((currentLetter) => {
                if(TextTokenizer.getWordDelimiters.indexOf(currentLetter) > -1){
                    delimiter += currentLetter
                    if(currentWord) {
                        wordTokens.push({currentWord});
                        currentWord = ""
                    }
                } else {
                    if(delimiter){
                        wordTokens.push({
                            currentWord: delimiter
                        });
                        delimiter = ""
                    }
                    currentWord += currentLetter;
                }
            })
            if(currentWord){
                wordTokens.push({currentWord});
            } else if(delimiter) {
                wordTokens.push({
                    currentWord: delimiter
                });
            }
        }
        return wordTokens;
    },
    getWordWidth(attrs) {
        const {
            currentWord, fontFamily, fontSize, isBold, isItalic
        } = attrs;
        const canvas = document.getElementById("text-tokenizer-canvas");
        const context = canvas.getContext("2d");
        let font = "";
        if(isBold){
            font += "bold ";
        }
        if(isItalic) {
            font += "italic ";
        }
        if(fontSize) {
            font += fontSize;
        }
        if(fontFamily) {
            font += fontFamily;
        }
        context.font = font;
        const metrics = context.measureText(currentWord);
        attrs.width = Math.round(metrics.width);
        attrs.height = Math.round(metrics.height);
        return attrs;
    }
}

export default TextTokenizer;
window.TextTokenizer = TextTokenizer;