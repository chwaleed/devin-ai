import MarkdownPreview from "@uiw/react-markdown-preview";

type props = {
  content: string;
};

function PreviewMKD({ content }: props) {
  return (
    <MarkdownPreview
      source={content}
      wrapperElement={{
        "data-color-mode": "light",
      }}
    />
  );
}

export default PreviewMKD;
