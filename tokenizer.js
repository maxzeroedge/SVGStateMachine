var TextTokenizer = {
    getWordDelimiters: [
        " ", "\n", "\t", ".", ",", "?", ":", ";"
    ],
    getWords(fullText){
        const wordTokens = [];
        if(fullText){
            let currentWord = ""
            let delimiter = "";
            fullText.split("").forEach((currentLetter) => {
                if(TextTokenizer.getWordDelimiters.indexOf(currentLetter) > -1){
                    delimiter += currentLetter
                    if(currentWord) {
                        wordTokens.push(currentWord);
                        currentWord = ""
                    }
                } else {
                    if(delimiter){
                        wordTokens.push(delimiter);
                        delimiter = ""
                    }
                    currentWord += currentLetter;
                }
            })
            if(currentWord){
                wordTokens.push(currentWord);
            } else if(delimiter) {
                wordTokens.push(delimiter);
            }
        }
        return wordTokens;
    }
}

export default TextTokenizer;
window.TextTokenizer = TextTokenizer;