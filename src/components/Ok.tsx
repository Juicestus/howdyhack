
import { Button, Card, Col, Container, Form, OverlayTrigger, Popover, Row, Table } from "react-bootstrap";
export default ({ onClick }: { onClick: any }) => {

  return (
    <>
          {/* <div style={{height: '23rem'}}></div> */}
      <Button variant="outline-success" type="button" size="sm" className="ok-btn" onClick={onClick} style={{  }}>
        Ok
      </Button>
    </>
  );
};