import { Editor, getSchema } from '@tiptap/react';
import DOMPurify from 'dompurify';
import { DOMSerializer, Node, DOMParser as PMDomParser, Schema } from 'prosemirror-model';
import { proxyAttributes, restoreAttributes } from 'skiff-front-utils';

import { MailboxEmailInfo, ThreadViewEmailInfo } from '../../../models/email';
import { sanitizeSignature } from '../../../utils/signatureUtils';
import { SKIFF_BLOCKQUOTE_CLASSNAME } from '../Blockquote/Blockquote';
import { buildEditorExtensions } from '../Extensions';

export const PmNodeToHtml = (doc: Node, schema: Schema) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  const htmlFragment = DOMSerializer.fromSchema(schema).serializeFragment(doc.content);
  const dom = document.implementation.createHTMLDocument();
  dom.body.appendChild(htmlFragment);
  restoreAttributes(dom);
  return dom.body.innerHTML;
};

export const fromEditorToHtml = (editor: Editor) => {
  const doc = editor.view.state.doc;
  return PmNodeToHtml(doc, editor.schema);
};

// TODO: Optimize this to take in multiple strings and return multiple text
// so we can skip the Editor instantiation for each one
export const convertHtmlToTextContent = (html: string) => {
  const schema = getSchema(buildEditorExtensions());

  const detachedDocument = document.implementation.createHTMLDocument();
  const div = detachedDocument.createElement('div');
  // eslint-disable-next-line no-unsanitized/property
  div.innerHTML = html;
  const parentNode = PMDomParser.fromSchema(schema).parse(div);

  let str = '';
  parentNode.content.forEach((node) => {
    str += node.textContent + '\t';
  });
  return str;
};

/** Helper for getting the HTML content of an email, defaulting to text if not set */
export const getEmailBody = (email: ThreadViewEmailInfo) =>
  email.decryptedHtml || email.decryptedTextAsHtml || email.decryptedText || '';

export const createReplyInitialContent = (
  email: MailboxEmailInfo,
  isFromAddressQuickAlias: boolean,
  signature?: string
) => {
  // User signature
  const signatureHtml = !!signature ? sanitizeSignature(signature, isFromAddressQuickAlias) : '';
  // Details of email being replied to
  const dateAndName = `On ${email.createdAt.toUTCString()}${email.from.name ? `, ${email.from.name}` : ''}`;
  const emailAddress = `${email.from.address} wrote:`;
  const sender = email.from.name || email.from.address;
  const body = getEmailBody(email);
  const { dom } = proxyAttributes(new DOMParser().parseFromString(body, 'text/html'), false);
  return DOMPurify.sanitize(`
    <p></p>
    <p></p>
    ${signatureHtml}
    <blockquote class="${SKIFF_BLOCKQUOTE_CLASSNAME}" data-skiff-sender="${sender}" data-skiff-mail="true">
        <p>${dateAndName}</p>
        <p>${emailAddress}</p>
        <p></p>
        ${dom.body.innerHTML}
    </blockquote>
    `);
};

export const createForwardContent = (email: MailboxEmailInfo) => {
  const body = getEmailBody(email);
  const { dom } = proxyAttributes(new DOMParser().parseFromString(body, 'text/html'), false);
  return dom.body.innerHTML;
};
