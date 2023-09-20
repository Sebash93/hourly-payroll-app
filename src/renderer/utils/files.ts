/* eslint-disable import/prefer-default-export */
export const print = (printableContentId: string) => {
  window.print();
};
/* export const print = (printableContentId: string) => {
  window.frames['print_frame'].document.body.innerHTML =
    document?.getElementById(printableContentId)?.innerHTML;
  window.frames['print_frame'].window.focus();
  window.frames['print_frame'].window.print();
}; */
