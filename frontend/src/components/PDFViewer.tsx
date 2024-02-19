export const PdfViewer = ({ fileUrl }: { fileUrl: string }) => {
  return fileUrl ? (
    <object data={fileUrl} type="application/pdf" width="100%" height="500px">
      <embed src={fileUrl} type="application/pdf" width="100%" height="500px" />
      This browser does not support PDFs. Please download the PDF to view it:{' '}
      <a href={fileUrl}>Download PDF</a>.
    </object>
  ) : null;
};
