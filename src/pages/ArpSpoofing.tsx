import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  Alert,
  Snackbar,
} from '@mui/material';
import { Info } from 'lucide-react';

interface MacDetails {
  vendorDetails: {
    companyName: string;
    companyAddress: string;
    countryCode: string;
  };
  blockDetails: {
    blockFound: boolean;
    borderBlock: string;
    assignmentBlockSize: string;
    dateCreated: string;
    dateUpdated: string;
  };
}

interface ArpEntry {
  mac: string;
  ips: string[];
}

const ArpSpoofing = () => {
  const [selectedMac, setSelectedMac] = useState<string | null>(null);
  const [macDetails, setMacDetails] = useState<MacDetails | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [showAlert, setShowAlert] = useState(true);
  const [arpData, setArpData] = useState<ArpEntry[]>([]);

  useEffect(() => {
    const fetchArpData = async () => {
      try {
        const response = await fetch('http://localhost:5000/arp-data');
        const data = await response.json();
        
        // Transform the data into the format we need
        const transformedData = Object.entries(data).map(([mac, ips]) => ({
          mac,
          ips: Array.isArray(ips) ? ips : [ips],
        }));
        
        setArpData(transformedData);
        
        // Show alert if there are any entries
        if (transformedData.length > 0) {
          setShowAlert(true);
        }
      } catch (error) {
        console.error('Error fetching ARP data:', error);
        // Fallback to mock data if the backend is not available
        setArpData([
          {
            mac: "08:00:27:04:42:0F",
            ips: ["192.168.1.10", "192.168.1.1"]
          },
          {
            mac: "00:1A:2B:3C:4D:5E",
            ips: ["192.168.1.102", "192.168.1.103"]
          }
        ]);
      }
    };

    // Initial fetch
    fetchArpData();

    // every 10 seconds
    const interval = setInterval(fetchArpData, 10000);

    return () => clearInterval(interval);
  }, []);

  const handleDetailsClick = async (mac: string) => {
    try {
      const response = await fetch(`https://api.macaddress.io/v1?apiKey=at_E2wSs83pyc7Pks7K5jg6zZa27dp4P&output=json&search=${mac}`);
      const data = await response.json();
      setMacDetails(data);
      setSelectedMac(mac);
      setOpenDialog(true);
    } catch (error) {
      console.error('Error fetching MAC details:', error);
    }
  };

  return (
    <Box>
      <Snackbar
        open={showAlert}
        autoHideDuration={6000}
        onClose={() => setShowAlert(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert 
          severity="error" 
          onClose={() => setShowAlert(false)}
          sx={{
            '& .MuiAlert-icon': {
              color: '#ff4444'
            },
            backgroundColor: 'rgba(255, 68, 68, 0.1)',
            color: '#ff4444',
            border: '1px solid rgba(255, 68, 68, 0.3)',
            fontWeight: 'bold'
          }}
        >
          Attack Detected: ARP Spoofing Attempt!
        </Alert>
      </Snackbar>

      <Typography variant="h4" gutterBottom sx={{ 
        background: 'linear-gradient(45deg, #9c27b0 30%, #2196f3 90%)',
        backgroundClip: 'text',
        WebkitBackgroundClip: 'text',
        color: 'transparent',
        fontWeight: 'bold'
      }}>
        ARP Spoofing Attacks
      </Typography>

      <TableContainer 
        component={Paper} 
        sx={{ 
          mt: 2,
          background: 'linear-gradient(145deg, rgba(25, 25, 25, 0.9), rgba(40, 40, 40, 0.9))',
          backdropFilter: 'blur(10px)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
          borderRadius: '16px',
          border: '1px solid rgba(255, 255, 255, 0.1)'
        }}
      >
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ color: '#fff', fontWeight: 'bold', borderBottom: '2px solid rgba(255, 255, 255, 0.1)' }}>
                MAC Address
              </TableCell>
              <TableCell sx={{ color: '#fff', fontWeight: 'bold', borderBottom: '2px solid rgba(255, 255, 255, 0.1)' }}>
                Connected IPs
              </TableCell>
              <TableCell align="right" sx={{ color: '#fff', fontWeight: 'bold', borderBottom: '2px solid rgba(255, 255, 255, 0.1)' }}>
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {arpData.map((row) => (
              <TableRow 
                key={row.mac}
                sx={{ 
                  '&:hover': { 
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    transition: 'all 0.3s ease'
                  }
                }}
              >
                <TableCell sx={{ color: '#fff', borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                  {row.mac}
                </TableCell>
                <TableCell sx={{ color: '#fff', borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                  {row.ips.join(', ')}
                </TableCell>
                <TableCell align="right" sx={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                  <Button
                    variant="contained"
                    startIcon={<Info />}
                    onClick={() => handleDetailsClick(row.mac)}
                    sx={{
                      background: 'linear-gradient(45deg, #9c27b0 30%, #2196f3 90%)',
                      boxShadow: '0 3px 5px 2px rgba(156, 39, 176, .3)',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: '0 6px 10px 4px rgba(156, 39, 176, .3)',
                      }
                    }}
                  >
                    Details
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog 
        open={openDialog} 
        onClose={() => setOpenDialog(false)} 
        maxWidth="md"
        PaperProps={{
          sx: {
            background: 'linear-gradient(145deg, rgba(25, 25, 25, 0.95), rgba(40, 40, 40, 0.95))',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            color: '#fff'
          }
        }}
      >
        <DialogTitle sx={{ 
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          background: 'linear-gradient(45deg, #9c27b0 30%, #2196f3 90%)',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          color: 'transparent',
          fontWeight: 'bold'
        }}>
          MAC Address Details: {selectedMac}
        </DialogTitle>
        <DialogContent>
          {macDetails && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="h6" sx={{ color: '#9c27b0', mb: 2 }}>Vendor Information</Typography>
              <Typography sx={{ mb: 1 }}>Company: {macDetails.vendorDetails.companyName}</Typography>
              <Typography sx={{ mb: 1 }}>Address: {macDetails.vendorDetails.companyAddress}</Typography>
              <Typography sx={{ mb: 3 }}>Country: {macDetails.vendorDetails.countryCode}</Typography>

              <Typography variant="h6" sx={{ color: '#2196f3', mb: 2 }}>Block Details</Typography>
              <Typography sx={{ mb: 1 }}>Block Size: {macDetails.blockDetails.assignmentBlockSize}</Typography>
              <Typography sx={{ mb: 1 }}>Date Created: {macDetails.blockDetails.dateCreated}</Typography>
              <Typography sx={{ mb: 1 }}>Date Updated: {macDetails.blockDetails.dateUpdated}</Typography>
            </Box>
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default ArpSpoofing;