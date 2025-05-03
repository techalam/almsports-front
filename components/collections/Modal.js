import { Backdrop, CircularProgress } from '@mui/material';
import axios from 'axios';
import { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import { useSelector } from 'react-redux';
import Swal from 'sweetalert2';

function CollectionModal({show, setShow, handleShow, handleClose, getAllCollections, selectedCollection, setSelectedCollection}) {
const user = useSelector((state) => state.auth);
console.log("user", user);
const [collectionName, setCollectionName] = useState(null);
const [open, setOpen] = useState(false);

  const saveCollection = async (e) => {
   try {
    setOpen(true);
     e.preventDefault();
     if(!collectionName || collectionName.trim() === '') {
       console.error('Collection name is required');
       return;
     }
 
     const response = await axios('https://almsports-node-techalams-projects.vercel.app/api/collections/createCollections', {
       method: 'POST',
       headers: {
         'Content-Type': 'application/json',
         'Authorization': `Bearer ${user?.accessToken}`,
       },
       data: {
         name: collectionName,
       },
     });
   
     if (response.status === 200) {
       console.log('Collection saved successfully!');
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'Collection saved successfully!',
        })
        setCollectionName(''); 
        setShow(false); 
        getAllCollections();
     } else {
       console.error('Error saving collection:', response.statusText);
     }
   } catch (error) {
      console.error('Error saving collection:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error saving collection',
        text: error?.response?.data?.error || 'Error saving collection!',
      })
   }
    finally {
      setOpen(false);
    }
  }

  const updateCollection = async (e) => {
    try {
      setOpen(true);
      e.preventDefault();
      if(!collectionName || collectionName.trim() === '') {
        console.error('Collection name is required');
        return;
      }
  
      const response = await axios('https://almsports-node-techalams-projects.vercel.app/api/collections/updateCollection', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user?.accessToken}`,
        },
        data: {
          name: collectionName,
          id: selectedCollection?.id,
        },
      });
    
      if (response.status === 200) {
        console.log('Collection updated successfully!');
         Swal.fire({
           icon: 'success',
           title: 'Success',
           text: 'Collection updated successfully!',
         })
         setCollectionName(''); 
         setShow(false); 
         setSelectedCollection(null)
         getAllCollections();
      } else {
        console.error('Error updating collection:', response.statusText);
      }
    } catch (error) {
       console.error('Error updating collection:', error);
       Swal.fire({
         icon: 'error',
         title: 'Error updating collection',
         text: error?.response?.data?.error || 'Error updating collection!',
       })
    }
      finally {
        setOpen(false);
      }
   }

  return (
    <>
      <Modal show={show || selectedCollection} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Modal heading</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form >
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Collection ID</Form.Label>
              <Form.Control
                type="number"
                placeholder="Collection ID"
                autoFocus
                disabled
                value={selectedCollection ? selectedCollection?.id : ''}
              />
            </Form.Group>
            <Form.Group
              className="mb-3"
              controlId="exampleForm.ControlTextarea1"
            >
              <Form.Label>Collection Name</Form.Label>
              <Form.Control placeholder='Enter Collection Name' rows={3} value={collectionName} 
              onChange={(e) => setCollectionName(e.target.value)}
              defaultValue={selectedCollection ? selectedCollection.name : ''}
              required
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" type='submit' onClick={selectedCollection ? updateCollection : saveCollection}
          style={{background: 'linear-gradient(135deg, #43cea2, #185a9d)'}}>
            {selectedCollection ? 'Update' : 'Save'}
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

export default CollectionModal;