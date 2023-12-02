export const pdfAnnotationsStyles = `
  .annotationLayer section {
    position: absolute;
    text-align: initial;
  }

  .annotationLayer .linkAnnotation > a,
  .annotationLayer .buttonWidgetAnnotation.pushButton > a {
    position: absolute;
    font-size: 1em;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }

  .annotationLayer .buttonWidgetAnnotation.pushButton > canvas {
    position: relative;
    top: 0;
    left: 0;
    z-index: -1;
  }

  .annotationLayer .linkAnnotation > a:hover,
  .annotationLayer .buttonWidgetAnnotation.pushButton > a:hover {
    opacity: 0.2;
    background: rgba(255, 255, 0, 1);
    box-shadow: 0 2px 10px rgba(255, 255, 0, 1);
  }

  .annotationLayer .textAnnotation img {
    position: absolute;
    cursor: pointer;
  }

  .annotationLayer .textWidgetAnnotation input,
  .annotationLayer .textWidgetAnnotation textarea,
  .annotationLayer .choiceWidgetAnnotation select,
  .annotationLayer .buttonWidgetAnnotation.checkBox input,
  .annotationLayer .buttonWidgetAnnotation.radioButton input {
    background-image: var(--annotation-unfocused-field-background);
    border: 1px solid transparent;
    box-sizing: border-box;
    font-size: 9px;
    height: 100%;
    margin: 0;
    padding: 0 3px;
    vertical-align: top;
    width: 100%;
  }

  .annotationLayer .choiceWidgetAnnotation select option {
    padding: 0;
  }

  .annotationLayer .buttonWidgetAnnotation.radioButton input {
    border-radius: 50%;
  }

  .annotationLayer .textWidgetAnnotation textarea {
    font: message-box;
    font-size: 9px;
    resize: none;
  }

  .annotationLayer .textWidgetAnnotation input[disabled],
  .annotationLayer .textWidgetAnnotation textarea[disabled],
  .annotationLayer .choiceWidgetAnnotation select[disabled],
  .annotationLayer .buttonWidgetAnnotation.checkBox input[disabled],
  .annotationLayer .buttonWidgetAnnotation.radioButton input[disabled] {
    background: none;
    border: 1px solid transparent;
    cursor: not-allowed;
  }

  .annotationLayer .textWidgetAnnotation input:hover,
  .annotationLayer .textWidgetAnnotation textarea:hover,
  .annotationLayer .choiceWidgetAnnotation select:hover,
  .annotationLayer .buttonWidgetAnnotation.checkBox input:hover,
  .annotationLayer .buttonWidgetAnnotation.radioButton input:hover {
    border: 1px solid rgba(0, 0, 0, 1);
  }

  .annotationLayer .textWidgetAnnotation input:focus,
  .annotationLayer .textWidgetAnnotation textarea:focus,
  .annotationLayer .choiceWidgetAnnotation select:focus {
    background: none;
    border: 1px solid transparent;
  }

  .annotationLayer .textWidgetAnnotation input :focus,
  .annotationLayer .textWidgetAnnotation textarea :focus,
  .annotationLayer .choiceWidgetAnnotation select :focus,
  .annotationLayer .buttonWidgetAnnotation.checkBox :focus,
  .annotationLayer .buttonWidgetAnnotation.radioButton :focus {
    background-image: none;
    background-color: transparent;
    outline: auto;
  }

  .annotationLayer .buttonWidgetAnnotation.checkBox input:checked:before,
  .annotationLayer .buttonWidgetAnnotation.checkBox input:checked:after,
  .annotationLayer .buttonWidgetAnnotation.radioButton input:checked:before {
    background-color: rgba(0, 0, 0, 1);
    content: '';
    display: block;
    position: absolute;
  }

  .annotationLayer .buttonWidgetAnnotation.checkBox input:checked:before,
  .annotationLayer .buttonWidgetAnnotation.checkBox input:checked:after {
    height: 80%;
    left: 45%;
    width: 1px;
  }

  .annotationLayer .buttonWidgetAnnotation.checkBox input:checked:before {
    transform: rotate(45deg);
  }

  .annotationLayer .buttonWidgetAnnotation.checkBox input:checked:after {
    transform: rotate(-45deg);
  }

  .annotationLayer .buttonWidgetAnnotation.radioButton input:checked:before {
    border-radius: 50%;
    height: 50%;
    left: 30%;
    top: 20%;
    width: 50%;
  }

  .annotationLayer .textWidgetAnnotation input.comb {
    font-family: monospace;
    padding-left: 2px;
    padding-right: 0;
  }

  .annotationLayer .textWidgetAnnotation input.comb:focus {
    /*
   * Letter spacing is placed on the right side of each character. Hence, the
   * letter spacing of the last character may be placed outside the visible
   * area, causing horizontal scrolling. We avoid this by extending the width
   * when the element has focus and revert this when it loses focus.
   */
    width: 103%;
  }

  .annotationLayer .buttonWidgetAnnotation.checkBox input,
  .annotationLayer .buttonWidgetAnnotation.radioButton input {
    appearance: none;
    padding: 0;
  }

  .annotationLayer .popupWrapper {
    position: absolute;
    width: 20em;
  }

  .annotationLayer .popup {
    position: absolute;
    z-index: 200;
    max-width: 20em;
    background-color: rgba(255, 255, 153, 1);
    box-shadow: 0 2px 5px rgba(136, 136, 136, 1);
    border-radius: 2px;
    padding: 6px;
    margin-left: 5px;
    cursor: pointer;
    font: message-box;
    font-size: 9px;
    white-space: normal;
    word-wrap: break-word;
  }

  .annotationLayer .popup > * {
    font-size: 9px;
  }

  .annotationLayer .popup h1 {
    display: inline-block;
  }

  .annotationLayer .popupDate {
    display: inline-block;
    margin-left: 5px;
  }

  .annotationLayer .popupContent {
    border-top: 1px solid rgba(51, 51, 51, 1);
    margin-top: 2px;
    padding-top: 2px;
  }

  .annotationLayer .richText > * {
    white-space: pre-wrap;
  }

  .annotationLayer .highlightAnnotation,
  .annotationLayer .underlineAnnotation,
  .annotationLayer .squigglyAnnotation,
  .annotationLayer .strikeoutAnnotation,
  .annotationLayer .freeTextAnnotation,
  .annotationLayer .lineAnnotation svg line,
  .annotationLayer .squareAnnotation svg rect,
  .annotationLayer .circleAnnotation svg ellipse,
  .annotationLayer .polylineAnnotation svg polyline,
  .annotationLayer .polygonAnnotation svg polygon,
  .annotationLayer .caretAnnotation,
  .annotationLayer .inkAnnotation svg polyline,
  .annotationLayer .stampAnnotation,
  .annotationLayer .fileAttachmentAnnotation {
    cursor: pointer;
  }
`;
