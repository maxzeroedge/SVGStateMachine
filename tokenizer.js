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
            font += fontSize + " ";
        }
        if(fontFamily) {
            // if(/^\s+$/.test(currentWord)){
            //     font += "Times New Roman";
            // } else {
            //     font += fontFamily;
            // }
            font += fontFamily;
        }
        context.font = font;
        const metrics = context.measureText(currentWord);
        if(/^\s+$/.test(currentWord)){
            attrs.width = Math.ceil(metrics.width);
        } else {
            attrs.width = Math.round(metrics.width);
        }
        // attrs.height = Math.round(metrics.height);
        return attrs;
    },
    breakByWidth({wordTokens, width}) {
        const widthDivision = [];
        let tempWidthCollection = [];
        let currentWidth = 0;
        wordTokens.forEach(wordToken => {
            let tempWidth = currentWidth + wordToken.width;
            if(tempWidth > width){
                widthDivision.push(tempWidthCollection);
                tempWidthCollection = [wordToken];
                currentWidth = wordToken.width;
            } else if (tempWidth == width) {
                tempWidthCollection.push(wordToken);
                widthDivision.push(tempWidthCollection);
                tempWidthCollection = [];
                currentWidth = 0;
            } else {
                currentWidth = tempWidth;
                tempWidthCollection.push(wordToken);
            }
        })
        if(tempWidthCollection.length){
            widthDivision.push(tempWidthCollection);
        }
        return widthDivision;
    }
}

export default TextTokenizer;
window.TextTokenizer = TextTokenizer;