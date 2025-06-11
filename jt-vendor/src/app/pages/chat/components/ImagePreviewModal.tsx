import React from 'react'
import {Modal} from 'react-bootstrap'

interface ImagePreviewModalProps {
  show: boolean
  onHide: () => void
  imageSrc: string
}

const ImagePreviewModal: React.FC<ImagePreviewModalProps> = ({show, onHide, imageSrc}) => {
  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>Image Preview</Modal.Title>
      </Modal.Header>
      <Modal.Body className="p-0">
        <img 
          src={imageSrc} 
          alt="Preview" 
          style={{
            width: '100%',
            height: 'auto',
            maxHeight: '80vh',
            objectFit: 'contain'
          }}
        />
      </Modal.Body>
    </Modal>
  )
}

export default ImagePreviewModal 