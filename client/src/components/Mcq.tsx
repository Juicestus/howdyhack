
import React from "react";
import { Button, Card, Col, Container, Form, OverlayTrigger, Popover, Row, Table } from "react-bootstrap";
export default ({ onClick, options }: { onClick: any, options: string[] }) => {

  const [answer, setAnswer] = React.useState<string>("");

  return (
    <>
      {options.map((opt) => (<Row>

        <Col xs={1}>
          <Form.Check
            checked={answer === opt}
            type={'radio'}
            style={{ marginLeft: '.5rem'}}
            onClick={() => setAnswer(opt)}
          />
        </Col>

        <Col xs={11}>
          {opt}
        </Col>
      </Row>
      ))}
      <Button disabled={answer === ""} variant="outline-success" type="button" size="sm" className="ok-btn mt-2" onClick={() => onClick(answer)}>
        Submit
      </Button>
    </>
  );
};