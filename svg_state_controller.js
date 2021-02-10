/**
 * State Controller for SVG
 * Created by palashc on Jan-07-21.
 */
var StateController = {
    /**
    * Converts the svg into a json string which also stores properties of each element to render it
    * @param {DOM QueryString} jQElem Selector of element containing the whole svg
    * @param {DOM QueryString} textSelector Selector of element to process
    */
    parseSVG: function(jQElem, textSelector){
        var self = this;
        var elementJsonList = [];
        // textSelector = textSelector || 'text';
        // var textElements = jQElem.find(textSelector);
        // for(var ind = 0; ind < textElements.length; ind++){
        //     var elementJson = self.parseElement(textElements[ind])
        //     if(elementJson){
        //         elementJsonList.push(elementJson);
        //     }
        // }
        var childNodes;
        if(textSelector){
            childNodes = document.querySelectorAll(jQElem + " " + textSelector);
        } else if(typeof jQElem == "string") {
            childNodes = document.querySelector(jQElem).childNodes;
        } else {
            childNodes = jQElem.childNodes;
        }
        for(var ind = 0; ind < childNodes.length; ind++){
            var elementJson = self.parseElement(childNodes[ind])
            if(elementJson){
                elementJsonList.push(elementJson);
            }
        }
        return elementJsonList;
    },
    /**
     * 
     * @param {DOM Node} parent 
     */
    parseElement: function(parent){
        var self = this;
        var elementJson = {}
        // if(parent.children().length){
        //     for(var ind = 0; ind < parent.children().length; ind++){
        //         elementJson.children = self.parseElement(parent.children().eq(i));
        //     }
        // }
        elementJson.tagName = parent.tagName;
        if(parent.childNodes.length){
            elementJson.children = [];
            parent.childNodes.forEach(function(childNode){
                var childElementJson = {};
                var nodeType = childNode.nodeName.toLowerCase();
                if(nodeType == "#text"){
                    childElementJson.textContent = childNode.textContent;
                } else {
                    childElementJson = self.parseElement(childNode);
                }
                elementJson.children.push(childElementJson);
            });
        }
        // Get all attributes into json
        elementJson.attributes = {};
        if(parent.attributes){
            for(var ind = 0; ind < parent.attributes.length; ind++){
                var attr = parent.attributes[ind];
                elementJson.attributes[attr.name] = attr.value;
            }
        }
        // Get Leftover text
        if(typeof $ !== undefined){
            var leftOverText = $(parent).clone().children().remove().end().text();
            elementJson.text = leftOverText;
        } else {
            // Find the DOM way
        }
        return elementJson;
    },
    /**
     * Converts the json into svg DOM element or HTML string
     * @param {JSON} elementJsonList Array representing the whole SVG 
     * in form of json
     * @param {Boolean} stringOnly Whether to return DOM Element or HTML
     */
    parseJsonToSvg: function(elementJsonList, htmlOnly){
        var self = this;
        if(!elementJsonList){
            return null;
        }
        var parsedElements = [];
        elementJsonList.forEach(function(elementJson){
            var parsedElement = self.createElement(elementJson, htmlOnly);
            parsedElements.push(parsedElement);
        })
        return parsedElements;
    },
    createElement: function(elementJson, htmlOnly){
        if(htmlOnly){
            return this.createHtmlElement(elementJson);
        } else {
            return this.createDomElement(elementJson)
        }
    },
    createDomElement: function(elementJson){
        var parsedElement, tagName;
        tagName = elementJson.tagName;
        parsedElement = document.createElement(tagName)
        if(elementJson.attributes){
            Object.keys(elementJson.attributes).forEach(function(attrs){
                parsedElement.setAttribute(attrs, elementJson.attributes[attrs]);
            })
        }
        if(elementJson.children && elementJson.children.length){
            var parsedElements = this.parseJsonToSvg(elementJson.children, false);
            parsedElements.forEach(function(parsedChild){
                parsedElement.appendChild(parsedChild);
            })
        }
        return parsedElement;
    },
    createHtmlElement: function(elementJson, htmlOpts){
        var parsedElement, tagName;
        tagName = elementJson.tagName;
        parsedElement = "<" + tagName;
        if(elementJson.attributes){
            Object.keys(elementJson.attributes).forEach(function(attrs){
                parsedElement += " " + attrs + "=\"" + elementJson.attributes[attrs] + "\"";
            })
        }
        parsedElement += ">";
        // Maybe use htmlOpts to store these?
        if(elementJson.children && elementJson.children.length){
            var parsedElements = this.parseJsonToSvg(elementJson.children, htmlOpts);
            parsedElements.forEach(function(parsedChild){
                // TODO: Prettify option here. Newline and tabs/spaces size*level
                parsedElement += parsedChild;
            })
        }
        // TODO: Prettify option here. Newline
        parsedElement += "</" + tagName + ">";
        return parsedElement;
    }
};
export default StateController;
window.StateController = StateController;