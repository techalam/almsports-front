import { Backdrop, CircularProgress } from '@mui/material';
import axios from 'axios';
import { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import { useSelector } from 'react-redux';
import Swal from 'sweetalert2';

function CatalougeModal({
  show,
  handleClose,
  getAllCatalouges,
  selectedCatalouge,
  setSelectedCatalouge,
}) {
  const user = useSelector((state) => state.auth);
  const [catalougeName, setCatalougeName] = useState('');
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (selectedCatalouge) {
      setCatalougeName(selectedCatalouge.name);
    } else {
      setCatalougeName('');
    }
  }, [selectedCatalouge]);

  const saveCatalouge = async (e) => {
    e.preventDefault();
    if (!catalougeName || catalougeName.trim() === '') {
      Swal.fire('Validation Error', 'Catalouge name is required', 'warning');
      return;
    }

    try {
      setOpen(true);
      const response = await axios.post(
        'https://almsports-node-techalams-projects.vercel.app/api/catalouges/createCatalouge',
        { name: catalougeName },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${user?.accessToken}`,
          },
        }
      );
      if (response.status === 200) {
        Swal.fire('Success', 'Catalouge created successfully!', 'success');
        setCatalougeName('');
        handleClose();
        getAllCatalouges();
      }
    } catch (error) {
      console.error('Error saving catalouge:', error);
      Swal.fire('Error', error?.response?.data?.error || 'Could not save catalouge', 'error');
    }
    finally {
      setOpen(false);
    }
  };

  const updateCatalouge = async (e) => {
    e.preventDefault();
    if (!catalougeName || catalougeName.trim() === '') {
      Swal.fire('Validation Error', 'Catalouge name is required', 'warning');
      return;
    }

    try {
      setOpen(true);
      const response = await axios.put(
        'https://almsports-node-techalams-projects.vercel.app/api/catalouges/updateCatalouge',
        {
          id: selectedCatalouge?.id,
          name: catalougeName,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${user?.accessToken}`,
          },
        }
      );

      if (response.status === 200) {
        Swal.fire('Success', 'Catalouge updated successfully!', 'success');
        setCatalougeName('');
        handleClose();
        setSelectedCatalouge(null);
        getAllCatalouges();
      }
    } catch (error) {
      console.error('Error updating catalouge:', error);
      Swal.fire('Error', error?.response?.data?.error || 'Could not update catalouge', 'error');
    }
    finally {
      setOpen(false);
    }
  };

  return (
    <>
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>{selectedCatalouge ? 'Edit Catalouge' : 'Add Catalouge'}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={selectedCatalouge ? updateCatalouge : saveCatalouge}>
          <Form.Group className="mb-3" controlId="catalougeId">
            <Form.Label>ID</Form.Label>
            <Form.Control
              type="text"
              value={selectedCatalouge ? selectedCatalouge.id : ''}
              disabled
              placeholder="Auto-generated"
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="catalougeName">
            <Form.Label>Catalouge Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter catalouge name"
              value={catalougeName}
              onChange={(e) => setCatalougeName(e.target.value)}
              required
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <Button
          variant="primary"
          type="submit"
          onClick={selectedCatalouge ? updateCatalouge : saveCatalouge}
          style={{
            background: 'linear-gradient(135deg, #43cea2, #185a9d)',
            border: 'none',
          }}
        >
          {selectedCatalouge ? 'Update' : 'Save'}
        </Button>
      </Modal.Footer>
    </Modal>

    <Backdrop
      sx={{
        color: "#fff",
        zIndex: (theme) => theme.zIndex.drawer + 1,
      }}
      open={open}
    >
      <CircularProgress color="inherit" />
    </Backdrop>
    </>
  );
}

export default CatalougeModal;
