import { Box, Button, Card, CardActions, CardContent, Dialog, DialogActions, DialogContent, Divider, FormControl, IconButton, InputLabel, MenuItem, Select, Stack, Typography, useMediaQuery } from "@mui/material";
import React, { useEffect } from "react";
import { useState } from "react";
import Grid from '@mui/material/Grid2';
// import ThankYouPage from "./Thankyou";
import CancelIcon from '@mui/icons-material/Cancel';
import Network from "./Network";
import instId from "./InstituteId";
import CloseIcon from '@mui/icons-material/Close';

const ContactUs = ({ setApiResponse, selectedAction, handleClose, courses }) => {

    const queryParam = new URLSearchParams(location.search);
    const isMobile = useMediaQuery("(min-width:600px)");
    const campaignId = queryParam.get("campaignid");
    const metaCampaignId = queryParam.get("campaign_id");
    const mobile = useMediaQuery("(min-width:600px)");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [number, setNumber] = useState("");
    const [emailId, setEmailId] = useState("");
    const [message, setMessage] = useState("");
    const [course, setCourse] = useState("");
    const [typeSelect, setTypeSelect] = useState("course");
    const [coursesData, setCoursesData] = useState([]);
    const [error, setError] = useState("");
    const [address, setAddress] = useState('');
    const [openSyllabus, setOpenSyllabus] = useState(false);
    const [openSamplePaper, setOpenSamplePaper] = useState(false);
    const [openThankyou, setOpenThankyou] = useState(false);
    const [selectedCourse, setSelectedCourse] = useState('');
    const [openModal, setOpenModal] = useState(true);

    const handleSelectCourse = (e, item) => {
        setSelectedCourse(e.target.value)
    };

    const handleOpenThankyou = () => {
        setOpenThankyou(true);
        handleClose();
        setTimeout(() => {
            setOpenThankyou(false);
        }, 5000);
    };

    const handleCloseThankyou = () => {
        setOpenThankyou(false);
        handleClose();
    };

    const handleOpenSyllabus = () => {
        setOpenSyllabus(true);
    };
    const handleCloseSyllabus = () => {
        setOpenSyllabus(false);
        handleClose();
        handleCloseThankyou();
    };

    const handleOpenSamplePaperModal = () => {
        setOpenSamplePaper(true);
    };
    const handleCloseSamplePaperModal = () => {
        setOpenSamplePaper(false);
        handleClose();
        handleCloseThankyou();
    };


    useEffect(() => {
        if (typeSelect === "course") {
            getAllCourses();
        } else if (typeSelect === "testSeries") {
            getTestSeries();
        }

    }, [typeSelect]);

    const handleChangeCourse = (e) => {
        setCourse(e.target.value)
    }

    const getAllCourses = async () => {
        try {
            const response = await Network.fetchCourses(instId);
            let templist = response.courses.filter(course =>
                course.active === true &&
                course.tags.some(tag => tag.tag === "Enquiry From Course")
            );
            setCoursesData(templist);
        } catch (error) {
            console.log(error);
        }
    };
    const getTestSeries = async () => {
        try {
            const response = await Network.fetchTestSeries(instId);
            let templist = [];
            response.testSeriesList.forEach((course) => {
                if (course.active == true) {
                    templist.push(course);
                }
            })
            setCoursesData(response?.testSeriesList);
        } catch (error) {
            console.log(error);
        }
    };

    // console.log('Data', firstName, lastName, number, emailId, typeSelect, course, message)

    const handleSubmit = async () => {
        if (firstName && number && selectedCourse) {

            const body = {
                "firstName": firstName,
                // "lastName": lastName,
                "lastName": 'last',
                // "email": emailId,
                "email": 'aurous',
                "contact": number,
                "enquiryType": typeSelect,
                "contentId": Number(course),
                "instId": instId,
                "domain": selectedCourse,
                "campaignId": campaignId ? campaignId : metaCampaignId ? metaCampaignId : null
            }
            const response = await Network.submitForm(body);

            if (response?.errorCode === 0) {
                localStorage.setItem('formSubmitted', 'true');
                setFirstName("");
                setLastName("");
                setNumber(""); ``
                setEmailId("");
                setTypeSelect("");
                setCourse("");
                setMessage("");
                setError("");
                setSelectedCourse('');
                handleOpenThankyou();
                setOpenModal(false)
                // setTimeout(() => {
                //     if (selectedAction === 'samplePaper') {
                //         handleOpenSamplePaperModal();
                //     } else if (selectedAction === 'syllabus') {
                //         handleOpenSyllabus();
                //     };
                // }, 3000);
                // handleClose();
            }
        }
        else {
            setError("All fields Are required");
        }
    };

    return (
        <>
            <Dialog open={openModal} sx={{
                "& .MuiDialog-container": {
                    "& .MuiPaper-root": {
                        width: "100%",
                        maxWidth: "400px",
                    },
                },
            }}>
                <DialogContent sx={{ flex: 1, padding: 0 }}>
                    {/* <Box sx={{ textAlign: 'end', width: "100%" }}>
                        <IconButton
                            aria-label="close"
                            onClick={() => setOpenModal(false)}
                        >
                            <CloseIcon fontSize="large" />
                        </IconButton>
                    </Box> */}
                    <Divider sx={{
                        width: "100%",
                        height: "fit-content",
                        backgroundColor: "#e0e0e0",
                    }} />
                    <Grid container sx={{ display: "flex", justifyContent: "center", p: 0 }}>
                        {/* <Stack direction={'row'} width={'100%'}>
                            <CancelIcon
                                onClick={handleClose}
                                sx={{
                                    cursor: 'pointer',
                                    color: '#fff',
                                    position: 'absolute',
                                    right: 0,
                                    top: 0
                                }}
                            />
                        </Stack> */}
                        <Grid size={{ xs: 12, sm: 12, md: 12, lg: 12 }}>
                            <Card
                                sx={{
                                    width: '100%',
                                    // maxWidth: 10,
                                    background: '#101828',
                                    height: '100%',
                                    // maxHeight: isMobile ? 440 : 100,
                                }}
                            >
                                <CardContent>
                                    <Typography
                                        color={'#fff'}
                                        fontSize={'20px'}
                                        textAlign={'center'}
                                    >
                                        WE ARE JUST A CALL AWAY!
                                    </Typography>
                                    <Typography
                                        color={'#667085'}
                                        fontSize={'18px'}
                                        textAlign={'center'}
                                        py={1}
                                    >
                                        Step closer to your goals with a expert mentoring sesseion
                                    </Typography>
                                    <Box
                                        py={0.12}
                                    >
                                        <input
                                            placeholder='Enter your Name'
                                            type='text'
                                            value={firstName}
                                            onChange={(e) => setFirstName(e.target.value)}
                                            style={{
                                                width: '100%',
                                                height: '50px',
                                                borderRadius: '5px',
                                                boxSizing: 'border-box'
                                            }}
                                        />
                                    </Box>
                                    <Box
                                        py={0.8}
                                    >
                                        <input
                                            placeholder='Enter your Mobile Number'
                                            type='number' name='number' id='number'
                                            value={number}
                                            onChange={(e) => {
                                                const inputValue = e.target.value.replace(/\D/g, ""); // Remove non-numeric characters
                                                if (inputValue.length <= 10) {
                                                    setNumber(inputValue);
                                                }
                                            }}
                                            style={{
                                                width: '100%',
                                                height: '50px',
                                                borderRadius: '5px',
                                                boxSizing: 'border-box'
                                            }}
                                        />
                                    </Box>
                                    <Box
                                        py={0.8}
                                    >
                                        <input
                                            placeholder='Enter your Address'
                                            type='text'
                                            value={address}
                                            onChange={(e) => setAddress(e.target.value)}
                                            style={{
                                                width: '100%',
                                                height: '50px',
                                                borderRadius: '5px',
                                                boxSizing: 'border-box'
                                            }}
                                        />
                                        {/* <p
                                    style={{
                                        color: '#fff',
                                        fontSize: '8px',
                                        position: 'absolute',
                                        top: isMobile ? '60%' : '64%',
                                        left: isMobile ? '84%' : '74%',
                                        textAlign: 'end',
                                        // width: '24.5%'
                                    }}
                                >(Optional)</p> */}
                                    </Box>
                                    {/* <Box
                                        py={1}
                                    >
                                        <select
                                            style={{
                                                width: '100%',
                                                height: '35px',
                                                borderRadius: '5px',
                                                boxSizing: 'border-box'
                                            }}
                                            value={course}
                                            onChange={(e) => handleChangeCourse(e)}
                                        >
                                            <option
                                                style={{ fontSize: '16px', margin: '10px' }}
                                            >
                                                Select Class
                                            </option>
                                            {
                                                coursesData.length > 0 && coursesData.map((course, index) => {
                                                    return (
                                                        <option
                                                            style={{ fontSize: '16px', margin: '10px' }}
                                                            key={index}
                                                            value={course?.id}
                                                        >
                                                            {course?.title}
                                                        </option>
                                                    )
                                                })
                                            }
                                        </select>
                                    </Box> */}
                                    <Box
                                        py={1}
                                    >
                                        <FormControl className='mobile-select-button' fullWidth>
                                            <InputLabel id="demo-simple-select-label" sx={{ fontSize: "13px" }}>Select Course</InputLabel>
                                            <Select
                                                className='select-option'
                                                sx={{ mb: 3, fontSize: "12px", width: "100%", mr: 2, background: "#fff" }}
                                                labelId="demo-simple-select-label"
                                                id="demo-simple-select"
                                                label="Select Course"
                                                value={selectedCourse || ""}
                                                onChange={(e) => handleSelectCourse(e)}
                                            >
                                                {
                                                    courses && courses.map((item, index) => {
                                                        return (
                                                            <MenuItem key={index} value={item?.title}>{item?.title}</MenuItem>
                                                        )
                                                    })
                                                }
                                            </Select>
                                        </FormControl>
                                        {/* <select
                                            style={{
                                                width: '100%',
                                                height: '35px',
                                                borderRadius: '5px',
                                                boxSizing: 'border-box'
                                            }}
                                            value={selectedCourse}
                                            onChange={(e) => handleSelectCourse(e)}
                                        >
                                            {
                                                courses?.length > 0 && courses?.map((item, i) => {
                                                    return <option
                                                        key={i}
                                                        value={item?.title}
                                                        style={{ fontSize: '16px', margin: '10px' }}
                                                    >
                                                        {item?.title}
                                                    </option>
                                                })
                                            }

                                        </select> */}
                                    </Box>
                                </CardContent>
                                {/* <CardActions
                            sx={{
                                display: 'flex',
                                justifyContent: 'center',
                                paddingBottom: '20px',
                            }}
                        > */}
                                <Stack direction={'row'} display={'flex'} justifyContent={'center'} mb={2}>
                                    <Button
                                        onClick={handleSubmit}
                                        sx={{
                                            background: '#FFD700',
                                            textTransform: 'none',
                                            color: '#101828',
                                            borderRadius: '5px',
                                            width: isMobile ? '92%' : '88%',
                                            fontSize: '16px',
                                            fontWeight: '600',
                                            padding: '5px',
                                            ":hover": {
                                                background: '#FFD700',
                                            }
                                        }}
                                    >
                                        Submit Now
                                    </Button>
                                </Stack>
                                {/* </CardActions> */}
                            </Card>
                        </Grid>
                    </Grid>
                </DialogContent>
                {/* <DialogActions>
                    <Button onClick={() => setOpenModal(false)}>Close</Button>
                </DialogActions> */}
            </Dialog>
        </>
    )
}

export default ContactUs