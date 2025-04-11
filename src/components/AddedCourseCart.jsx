import { Box, Button, Dialog, Divider, Grid2, keyframes, Stack, Typography, useMediaQuery } from "@mui/material";
import React, { useEffect, useState } from "react";
import parse from "html-react-parser";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "./Endpoints";
import instId from "./InstituteId";
import ProceedToCheckoutForm from "./ProceedToCheckout";
import CloseIcon from '@mui/icons-material/Close';
import playStore from '../assets/playStore1.svg';
import windowsStore from '../assets/windowsStore.svg';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';

const MultipleCourseCart = () => {

    const zoomInOut = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.1); }
  100% { transform: scale(1); }
`;

    const navigate = useNavigate();
    const isMobile = useMediaQuery("(min-width:600px)");
    let cartData = localStorage.getItem('cartCourses');
    const [cartCourses, setCartCourses] = useState([]);
    const [finalAmounts, setFinalAmounts] = useState(0);
    const [proceedToCheckoutModal, setProceedToCheckoutModal] = useState(false);
    const [openThankYouDialog, setOpenThankYouDialog] = useState(false);
    const [endpoints, setEndpoints] = useState('')

    useEffect(() => {
        if (cartData !== null && cartData !== undefined) {
            setCartCourses(cartData ? JSON.parse(cartData) : [])
        }
    }, [cartData])

    useEffect(() => {
        if (cartCourses) {
            updateFinalAmount(cartCourses)
        }
    }, [cartCourses])

    useEffect(() => {
        getInstituteDetail();
    }, [])

    const getInstituteDetail = async () => {
        try {
            let requestOptions = {
                // headers: { "X-Auth": token },
                withCredentials: false,
            };
            const response = await axios.get(
                BASE_URL + "/getMetaData/fetch-institute/" + instId,
                requestOptions
            );
            if (response?.data?.errorCode === 0) {
                setEndpoints(response?.data?.instituteTechSetting?.mediaUrl)
                // Endpoints = response?.data?.instituteTechSetting?.mediaUrl
            };
        } catch (error) {
            console.log(error);
        }
    };

    const handleRemoveItem = (item, i) => {
        let temp = [];
        cartCourses.forEach((item, x) => {
            if (x !== i) {
                temp.push(item)
            }
        })
        setCartCourses(temp);
        localStorage.setItem('cartCourses', JSON.stringify(temp));
        if (temp?.length === 0) {
            navigate(`/courseDetails?courseName=${encodeURIComponent('CA')}`)
        }
    }

    const updateFinalAmount = (cartItems) => {
        const totalAmount = cartItems.reduce((sum, item) => {
            const taxLab = item.taxLab ?? 0;
            const taxLabAmount = (item.finalPrice * taxLab) / 100;
            return sum + (item.finalPrice + taxLabAmount);
        }, 0);

        setFinalAmounts(totalAmount);
    };

    const handleProceedToCheckout = () => {
        setProceedToCheckoutModal(true)
    }

    const handleCloseThankYouDialog = () => {
        setOpenThankYouDialog(false);
    };

    const handleWindowStore = () => {
        const url = 'https://apps.microsoft.com/store/detail/9NVXFBT27F7V'
        window.open(url, '_blank', 'noreferrer');
    }

    const handlePlayStore = () => {
        const url = 'https://play.google.com/store/apps/details?id=com.classiolabs.classeskart'
        window.open(url, '_blank', 'noreferrer');
    }

    const handleWhatsApp = () =>{
        const url = 'https://api.whatsapp.com/send/?phone=8440930809&text=Hi+Team%2C+is+there+any+related+service+available+%3F&type=phone_number&app_absent=0';
        window.open(url, '_blank', 'noreferrer');
    }


    return (
        <React.Fragment>
            <Box sx={{ mt: 4, mb: 4, paddingLeft: isMobile ? '6rem' : '1rem', paddingRight: isMobile ? '6rem' : '1rem', paddingTop: isMobile ? '2rem' : '0.5rem', paddingBottom: isMobile ? '2rem' : '0.5rem' }}>
                <Grid2 container>
                    <Grid2 item size={{ xs: 12, sm: 12, md: 12, lg: 12 }}>
                        <Grid2 container>
                            {
                                cartCourses?.length > 0 && cartCourses?.map((item, i) => {
                                    return <Grid2 item size={{ xs: 12, sm: 12, md: 12, lg: 12 }} key={i} sx={{ position: "relative" }}>
                                        <Grid2 container sx={{ marginTop: "10px" }}>
                                            <Grid2 item size={{ xs: 12, sm: 4, md: 4, lg: 4 }}>
                                                <Box sx={{
                                                    background: "rgb(123 127 129 / 7%)",
                                                    margin: "15px", borderRadius: "8px", display: "flex", justifyContent: "center"
                                                }}>
                                                    <img src={item?.logo ? endpoints + item?.logo : 'img/folder-2.png'} style={{ width: '70%', padding: '5px', maxHeight: '200px', minHeight: "150px" }} alt="Preview" className='mobile-view-image' />

                                                </Box>
                                                <Box sx={{
                                                    background: "rgb(123 127 129 / 7%)",
                                                    margin: "15px", borderRadius: "8px", display: "flex", justifyContent: "center"
                                                }}>
                                                    {
                                                        item?.introVideo && (

                                                            <video controls src={item?.introVideo ? endpoints + item?.introVideo : ''} style={{ width: "70%", maxHeight: '200px', minHeight: "150px", padding: '5px' }} />

                                                        )
                                                    }
                                                </Box>
                                            </Grid2>
                                            <Grid2 item size={{ xs: 12, sm: 8, md: 8, lg: 8 }} sx={{ padding: "10px" }}>
                                                <Typography variant='h5' fontWeight={"bold"} sx={{ color: "#000" }}>
                                                    {item?.title}
                                                </Typography>

                                                {item?.paid ? (
                                                    <p>
                                                        <p style={{ fontWeight: 'bold' }}>
                                                            <p style={{ marginBottom: 0 }}>
                                                                Price Rs. {item?.finalPrice.toFixed(2)}
                                                            </p>
                                                        </p>
                                                    </p>
                                                ) : (
                                                    <p>Free</p>
                                                )}
                                                <Typography variant='p' sx={{}} className='desktop-view-discrip'>
                                                    {item?.description ? parse(item?.description) : ""}
                                                </Typography>
                                                <Box>
                                                    <Button onClick={() => handleRemoveItem(item, i)} sx={{ textTransform: "initial", fontSize: 'small', padding: '10px 0' }}>Remove from Cart</Button>
                                                </Box>
                                            </Grid2>
                                        </Grid2>
                                        <Divider sx={{
                                            width: "100%",
                                            margin: "10px auto",
                                            backgroundColor: "#e0e0e0",
                                            mb: 4,
                                            height: "unset"
                                        }} />
                                    </Grid2>
                                })
                            }
                        </Grid2>
                    </Grid2>
                </Grid2>
                <Stack direction={'row'} spacing={2}
                    sx={{
                        position: 'fixed',
                        display: 'flex',
                        justifyContent: 'center',
                        width: '100%',
                        top: !isMobile ? '75%' : '88%'
                    }}
                >
                    {
                        finalAmounts > 0 && (
                            <Button
                                onClick={handleProceedToCheckout}
                                sx={{
                                    position: 'relative',
                                    borderRadius: `4px`,
                                    fontWeight: '700',
                                    background: `rgb(221, 42, 61)`,
                                    color: `rgb(255, 255, 255)`,
                                    boxShadow: `rgba(0, 0, 0, 0.5) 4px 3px 14px 0px`,
                                    display: `flex`,
                                    justifyContent: 'center',
                                    gap: 1,
                                    alignItems: 'baseline',
                                    padding: `14px 11px`,
                                    fontSize: `12px`,
                                    animation: `${zoomInOut} 1.5s infinite ease-in-out`,
                                    transition: "transform 0.3s, box-shadow 0.3s",
                                    boxSizing: 'border-box',
                                    textDecoration: 'none',
                                    ":hover": {
                                        background: 'red!important'
                                    },
                                }}
                            >
                                Procced to checkout
                                <span style={{ color: 'yellow', fontSize: '10px', textTransform: 'none' }}>
                                    Total Price: ₹{finalAmounts.toFixed(2)}
                                </span>
                            </Button>
                        )
                    }

                </Stack>
            </Box>
            <Dialog
                open={openThankYouDialog}
                onClose={handleCloseThankYouDialog}
                sx={{
                    "& .MuiDialog-container": {
                        "& .MuiPaper-root": {
                            width: "100%",
                            maxWidth: "600px",
                        },
                    },
                }}
            >
                <Stack direction={'row'} spacing={2} display={'flex'} justifyContent={'flex-end'} alignItems={'center'} p={1}>
                    <CloseIcon sx={{ cursor: "pointer" }} onClick={handleCloseThankYouDialog} />
                </Stack>
                <Box sx={{ padding: "30px" }}>

                    <Typography
                        fontSize={'15px'}
                        fontWeight={'500'}
                        sx={{ mb: 2 }}
                    >
                        ✅ Your enrollment in the test series is successful!
                    </Typography>
                    <Typography
                        fontSize={'15px'}
                        fontWeight={'500'}
                        sx={{ mb: 2 }}
                    >
                        📲 To access the test series, please install our Android or Windows app.
                    </Typography>
                    <Typography
                        fontSize={'15px'}
                        fontWeight={'500'}
                        sx={{ mb: 2 }}
                    >
                        👇 Click on the icon below to install the app.
                    </Typography>
                    <Typography
                        fontSize={'15px'}
                        fontWeight={'500'}
                        sx={{ mb: 4 }}
                    >
                        💬 Need any help? Reach out to us on WhatsApp – we're here for you!
                    </Typography>


                    <Stack direction={'row'} spacing={2} pb={4} justifyContent={'center'}>
                        <img
                            onClick={handlePlayStore}
                            alt=''
                            src={playStore}
                            style={{
                                position: 'relative',
                                // right: isMobile ? '0.5rem' : '1rem',
                                width: '100%',
                                maxWidth: '150px',
                                cursor: "pointer"
                            }}
                        />
                        <img
                            onClick={handleWindowStore}
                            style={{
                                position: 'relative',
                                // right: isMobile ? '0.5rem' : '1rem',
                                width: '100%',
                                maxWidth: '150px',
                                cursor: "pointer"
                            }}
                            alt=''
                            src={windowsStore}
                        />
                        <WhatsAppIcon sx={{ fontSize: "43px", color: 'green' }} onClick={handleWhatsApp} />
                    </Stack>
                </Box>
            </Dialog>
            <Dialog
                open={proceedToCheckoutModal}
                onClose={() => setProceedToCheckoutModal(false)}
                sx={{
                    "& .MuiDialog-container": {
                        "& .MuiPaper-root": {
                            width: "100%",
                            maxWidth: "500px",
                        },
                    },
                }}
            >
                <ProceedToCheckoutForm setProceedToCheckoutModal={setProceedToCheckoutModal} cartCourses={cartCourses} setOpenThankYouDialog={setOpenThankYouDialog} />
            </Dialog>
        </React.Fragment>
    )
};

export default MultipleCourseCart;