import React from 'react';
import {
  Text, View
} from 'react-native';
import htmlparser from 'htmlparser2-without-node-native';
import entities from 'entities';

import AutoSizedImage from './AutoSizedImage';

const LINE_BREAK = '\n';
const PARAGRAPH_BREAK = '\n';
const BULLET = '\u2022 ';

const Img = props => {
  const width = Number(props.attribs['width']) || Number(props.attribs['data-width']) || 0;
  const height = Number(props.attribs['height']) || Number(props.attribs['data-height']) || 0;

  const imgStyle = {
    width,
    height,
  };
  const source = {
    uri: props.attribs.src,
    width,
    height,
  };
  return (
      <AutoSizedImage source={source} style={imgStyle} />
  );
};

export default function htmlToElement(lineHeight, rawHtml, opts, done) {
  function domToElement(dom, parent) {
    if (!dom) return null;

    return dom.map((node, index, list) => {
      if (opts.customRenderer) {
        const rendered = opts.customRenderer(node, index, list, parent, domToElement);
        if (rendered || rendered === null) return rendered;
      }

      if (node.type == 'text') {
        if (entities.decodeHTML(node.data).trim() == "") {
          return null
        } else {
          return (
            <Text key={index} style={[parent ? opts.styles[parent.name] : null,{marginLeft: 15, marginRight: 8, lineHeight: lineHeight, textAlign:'left'}]} selectable={true}>
               {entities.decodeHTML(node.data).trim()} {'\n'}
            </Text>
          );
        }
      }

      if (node.type == 'tag') {
        if (node.name == 'img') {
          return (
              <Img key={index} attribs={node.attribs} />
          );
        }

        let linkPressHandler = null;
        if (node.name == 'a' && node.attribs && node.attribs.href) {
          linkPressHandler = () => opts.linkHandler(entities.decodeHTML(node.attribs.href));
        }

        let linebreakBefore = null;
        let linebreakAfter = null;
        if (opts.addLineBreaks) {
          switch (node.name) {
          case 'pre':
            linebreakBefore = LINE_BREAK;
            break;
          case 'p':
            if (index < list.length - 1) {
              linebreakBefore = LINE_BREAK;
              linebreakAfter = PARAGRAPH_BREAK;
            } else {
              // linebreakBefore = LINE_BREAK;
              // linebreakAfter = LINE_BREAK;
            }
            break;
          case 'tr':
            linebreakAfter = LINE_BREAK;
            break;
          case 'td':
            linebreakAfter = LINE_BREAK;
            linebreakBefore = LINE_BREAK;
            break;
          case 'span':
            linebreakAfter = LINE_BREAK;
            break;
          case 'strong':
            linebreakBefore = LINE_BREAK;
            linebreakAfter = LINE_BREAK;
            break;
          case 'em':
            linebreakBefore = LINE_BREAK;
            linebreakAfter = LINE_BREAK;
            break;
          case 'br':
          case 'h1':
          case 'h2':
          case 'h3':
            linebreakAfter = LINE_BREAK;
            break;
          case 'h4':
          case 'h5':
            linebreakAfter = LINE_BREAK;
            break;
          }
        }

        let listItemPrefix = null;
        if (node.name == 'li') {
          if (parent.name == 'ol') {
            listItemPrefix = `${index + 1}. `;
          } else if (parent.name == 'ul') {
            listItemPrefix = BULLET;
          }
        }

        return (
          <View key={index} onPress={linkPressHandler} selectable={true}>
            {domToElement(node.children, node)}
          </View>
        );
      }
    });
  }
  // {linebreakBefore}
  // {listItemPrefix}
  // {linebreakAfter}
  const handler = new htmlparser.DomHandler(function(err, dom) {
    if (err) done(err);
    done(null, domToElement(dom));
  });
  const parser = new htmlparser.Parser(handler);
  parser.write(rawHtml);
  parser.done();
}
