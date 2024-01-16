import React from "react";
import { Modal, Button } from "react-bootstrap";

function ConfirmationDialog({ modalShow, hideModal, orderId, handleConfirm }) {
  return (
    <>
      <Modal show={modalShow} onHide={hideModal}>
        <Modal.Header closeButton>
          <Modal.Title>Cancel Order</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to cancel your order ? <br /> #OrderId:{" "}
          {orderId}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={hideModal}>
            Close
          </Button>
          <Button variant="danger" onClick={() => handleConfirm(orderId)}>
            Confirm Cancellation
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default ConfirmationDialog;
