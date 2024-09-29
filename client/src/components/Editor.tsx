
import React from "react";
import { Button, Card, Col, Container, Form, OverlayTrigger, Popover, Row, Table } from "react-bootstrap";

import Editor from "react-simple-code-editor";
// import { highlight, languages } from "prismjs/components/prism-core";
import { highlight, languages, highlightElement } from 'prismjs';


import "prismjs/components/prism-clike";
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-python";
import "prismjs/themes/prism.css";

export default ({ onClick }: { onClick: any }) => {

  const [code, setCode] = React.useState<string>("");

  return (
    <>
    <Editor
      value={code}
      placeholder="# write your response here"
      padding={10}
      onValueChange={(code) => {
        setCode(code)
      }}
      highlight={(code) => highlight(code, languages.python, "python")}
      className="code-editor"
    />
      
      <Button disabled={code === ""} variant="outline-success" type="button" size="sm" className="ok-btn mt-2" onClick={() => onClick(code)}>
        Submit
      </Button>
    </>
  );
};