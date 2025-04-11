import React, { useEffect, useState } from "react";
import { Box, Button, Dialog, DialogActions, DialogContent, FormControl, Grid2, InputLabel, MenuItem, Select, Tooltip, Typography, useMediaQuery } from "@mui/material";
import CustomCarousel from "./CustomCarosoul";
import instId from "./InstituteId";
import Network from "./Network";
import SuggestedCourseDialog from "./CombinationModal";
import parse from "html-react-parser";
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { useNavigate } from "react-router-dom";

export const ExploreCourseSection = ({ endpointsUrl, firstFilter, secondFilter, thirdFilter, setCourses }) => {

    let cartData = localStorage.getItem('cartCourses');
    const navigate = useNavigate();
    const isMobile = useMediaQuery("(min-width:600px)");
    const [levelOne, setLevelOne] = useState([]);
    const [levelTwo, setLevelTwo] = useState([]);
    const [levelThree, setLevelThree] = useState([]);
    const [selectedLevelOne, setSelectedLevelOne] = useState(null);
    const [selectedLevelTwo, setSelectedLevelTwo] = useState(null);
    const [course, setCourse] = useState([]);
    const [filterCourseGroupWise, setFilterCourseGroupWise] = useState([]);
    const [filterCourseSubjectWise, setFilterCourseSubjectWise] = useState([]);
    const [courseExpandedDescriptions, setCourseExpandedDescriptions] = useState(false);
    const [fullDes, setFullDes] = useState('');
    const [addedSuggestCourse, setAddedSuggestCourse] = useState({});
    const [suggestedCourseId, setSuggestedCourseId] = useState(null);
    const [suggestedCourseDialog, setSuggestedCourseDialog] = useState(false);
    const [cartCourses, setCartCourses] = useState([]);
    const [finalAmounts, setFinalAmounts] = useState(0);
    const [finalAmountsss, setFinalAmountsss] = useState(0);
    const [domainList, setDomainList] = useState([]);

    useEffect(() => {

        getDomainList();
    }, [])

    useEffect(() => {
        if (domainList?.length > 0) {
            getCourseList();
        }

    }, [domainList])

    useEffect(() => {
        if (cartData !== null && cartData !== undefined) {
            setCartCourses(cartData ? JSON.parse(cartData) : [])
        }
    }, [cartData])

    useEffect(() => {
        if (!course || course.length === 0) return;

        let filtered = [...course];

        const domainFilterMatch = (item, filterId) =>
            Array.isArray(item.domain) &&
            item.domain.some(domainItem => domainItem.id === filterId);

        // if (selectedLevelOne) {
        //     filtered = filtered.filter(item => domainFilterMatch(item, selectedLevelOne.id));
        // }
        if (selectedLevelTwo) {
            filtered = filtered.filter(item => domainFilterMatch(item, selectedLevelTwo.id));
        }


        // Separate into group-wise and subject-wise
        const groupWise = filtered.filter(item =>
            Array.isArray(item.tags) &&
            item.tags.some(tagObj => tagObj.tag === "Group Wise")
        );

        const subjectWise = filtered.filter(item =>
            Array.isArray(item.tags) &&
            item.tags.some(tagObj => tagObj.tag === "Subject Wise")
        );

        const allCourse = [...groupWise, ...subjectWise];
        setCourses(allCourse)
        setFilterCourseGroupWise(groupWise);
        setFilterCourseSubjectWise(subjectWise);
    }, [selectedLevelOne, selectedLevelTwo, course, firstFilter, secondFilter, thirdFilter]);


    const getDomainList = async () => {
        try {

            const domainResponse = await Network.fetchDomain();
            if (domainResponse?.errorCode === 0) {
                const data = domainResponse?.domains;
                const levelOneData = data;
                const levelTwoData = data[0]?.child || [];
                const levelThreeData = levelTwoData[0]?.child || [];
                const levelFourData = levelThreeData[0]?.child || [];
                setDomainList(data)
                setLevelOne(levelThreeData[0]?.child || []);
                if (levelFourData?.length > 0) {
                    setSelectedLevelOne(levelFourData[0])
                    const levelTwoData = levelFourData[0].child || [];
                    setLevelTwo(levelTwoData);
                    if (levelTwoData.length > 0) {
                        const firstLevelTwo = levelTwoData[0];
                        setSelectedLevelTwo(firstLevelTwo);
                    }
                }
                // setLevelTwo(levelFourData[0]?.child || []);
            }
        } catch (error) {
            console.error("Error fetching employees:", error);
        }
    };

    const findDomainById = (nodes, id) => {
        for (const node of nodes) {
            if (node.id === id) return node;
            if (node.child?.length) {
                const found = findDomainById(node.child, id);
                if (found) return found;
            }
        }
        return null;
    };

    const getAllLeafIds = (node) => {
        if (!node.child || node.child.length === 0) {
            return [node.id];
        }
        return node.child.flatMap(child => getAllLeafIds(child));
    };

    const filterCoursesByThirdFilter = (courseList, domainList, thirdFilter) => {
        if (!thirdFilter || !Array.isArray(domainList) || domainList.length === 0) return [];

        const matchedDomain = findDomainById(domainList, thirdFilter);

        if (!matchedDomain) return [];

        const leafIds = getAllLeafIds(matchedDomain);

        const filteredCourses = courseList.filter(course =>
            Array.isArray(course.domain) &&
            course.domain.some(domainItem => leafIds.includes(domainItem.id))
        );
        return filteredCourses;
    };


    const getCourseList = async () => {
        try {
            const response = await Network.fetchCourses(instId);

            if (response?.errorCode === 0) {
                const caCourses = response?.courses?.filter(course =>
                    course.active === true
                );
                const filteredByThird = filterCoursesByThirdFilter(caCourses, domainList, thirdFilter);
                setCourse(thirdFilter ? filteredByThird : caCourses);
            };
        } catch (error) {
            console.log(error);
        }
    };

    const handleLevelOneChange = (e) => {
        const id = parseInt(e.target.value?.id);
        setSelectedLevelOne(e.target.value);

        const selected = levelOne.find(item => item.id === id);
        const child = selected?.child || [];
        setLevelTwo(child);
    };

    const handleLevelTwoChange = (e) => {
        const id = parseInt(e.target.value?.id);
        setSelectedLevelTwo(e.target.value);
    };

    const handleExploreNow = () => {
        navigate('/explore-all')
    }

    const handleAddtoCart = (course) => {

        setCartCourses((prevCart) => {
            const isAlreadyAdded = prevCart.some(item => item.id === course.id);

            let updatedCart;

            if (isAlreadyAdded) {
                updatedCart = prevCart.filter(item => item.id !== course.id);
                localStorage.setItem('cartCourses', JSON.stringify(updatedCart));
            } else {
                setAddedSuggestCourse(course);
                setSuggestedCourseId(course.id);
                setSuggestedCourseDialog(true);
                return prevCart;
            }

            return updatedCart;
        });
    };

    const handleCloseSuggestedCourseDialog = () => {
        setSuggestedCourseDialog(false);
    };

    const handleFinalAmountUpdate = (amount) => {
        setFinalAmountsss(amount);
    };

    const truncateDescription = (description) => {
        const decodedDescription = description
            .replace(/&nbsp;/g, ' ')
            .replace(/&amp;/g, '&')
            .replace(/&lt;/g, '<')
            .replace(/&gt;/g, '>')
            .replace(/&quot;/g, '"')
            .replace(/&#39;/g, "'");

        const strippedDescription = decodedDescription
            .replace(/<[^>]*>/g, ' ')
            .split(/\s+/)
            .slice(0, 10)
            .join(' ');

        return strippedDescription;
    };
    const toggleExpandDescription = (des) => {
        setFullDes(des)
        setCourseExpandedDescriptions(true);
    };

    const handleShowCart = () => {
        navigate("/cart-courses")
    }

    return (
        <div>
            <Grid2 container>
                <Grid2 item size={{ xs: 12, sm: 12, md: 12, lg: 12 }} sx={{ mb: 2, mt: 2, ml: isMobile ? 2 : 0 }}>
                    <FormControl className='mobile-select-button'>
                        <InputLabel id="demo-simple-select-label" sx={{ fontSize: "13px" }}>Select Exam Stage</InputLabel>
                        <Select
                            className='select-option'
                            sx={{ mb: 3, minWidth: "100px", fontSize: "12px", width: "230px", mr: 2 }}
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={selectedLevelOne || ""}
                            label="Select Exam Stage"
                            onChange={handleLevelOneChange}
                        >
                            {
                                levelOne && levelOne.map((data, index) => {
                                    return (
                                        <MenuItem key={index} value={data}>{data?.name}</MenuItem>
                                    )
                                })
                            }
                        </Select>
                    </FormControl>
                    <FormControl className='mobile-select-button'>
                        <InputLabel id="demo-simple-select-label" sx={{ fontSize: "13px" }}>Select Plan</InputLabel>
                        <Select
                            className='select-option'
                            sx={{ mb: 3, minWidth: "100px", fontSize: "12px", width: "230px", mr: 2 }}
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={selectedLevelTwo || ""}

                            label="Select Plan"
                            onChange={handleLevelTwoChange}
                        >
                            {
                                levelTwo && levelTwo.map((data, index) => {
                                    return (
                                        <MenuItem key={index} value={data}>{data?.name}</MenuItem>
                                    )
                                })
                            }
                        </Select>
                    </FormControl>
                    {cartCourses?.length > 0 && (<Button disabled={cartCourses?.length > 0 ? false : true} onClick={handleShowCart} sx={{ fontWeight: "bold", color: "#000", fontSize: "14px", border: "1px solid #80808038", textTransform: "initial", background: '#1356C5', color: '#fff', padding: "12px", width: !isMobile ? "100%" : "fit-content" }} className='button-hover'><ArrowForwardIcon />&nbsp; Go to Cart Details</Button>)}
                    {
                        filterCourseGroupWise?.length > 0 && (
                            <Typography variant="h5" sx={{ fontWeight: "bold", color: "#000", mt: 2, mb: 2 }}>Group Wise</Typography>
                        )
                    }

                    <Grid2 container gap={1} sx={{ p: isMobile ? 1 : 0 }}>
                        {
                            filterCourseGroupWise && filterCourseGroupWise.map((item, i) => {
                                return <Grid2 item size={{ xs: 12, sm: 2.4, md: 2.4, lg: 2.4 }} sx={{ textAlign: "center", mb: 2, padding: isMobile ? "10px" : "" }}>
                                    <Box sx={{
                                        borderRadius: "10px", position: "relative", boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px",
                                        //  height: "300px"
                                    }}>
                                        <img
                                            alt={item?.title}
                                            src={endpointsUrl + item?.logo}
                                            style={{ width: "100%", minHeight: "120px", borderBottom: "1px solid #a9a9a92e", borderTopLeftRadius: "8px", borderTopRightRadius: "8px" }} />
                                        <Box sx={{ pb: 4, textAlign: "left", paddingLeft: "15px" }}>
                                            <Tooltip title={item?.title}>
                                                <Typography variant='h5' fontWeight={"bold"} sx={{ mt: 2, mb: 2, color: "black", fontSize: "15px" }}>
                                                    {item?.title?.split(" ").slice(0, 7).join(" ")}
                                                    {item?.title?.split(" ").length > 7 && "..."}
                                                </Typography>
                                            </Tooltip>
                                            <Typography variant='p' className='desktop-view-discrip' sx={{ fontSize: "12px" }}>
                                                {setCourseExpandedDescriptions === false ? truncateDescription(item?.description) : truncateDescription(item?.description)}
                                                {item?.description.length > 100 && (
                                                    <span style={{ color: 'blue', cursor: 'pointer', marginLeft: '5px', textDecoration: 'underline' }} onClick={() => toggleExpandDescription(item?.description)}>
                                                        {setCourseExpandedDescriptions ? 'more' : 'more'}
                                                    </span>
                                                )}
                                            </Typography>
                                            <Box sx={{ marginBottom: "20px", mt: 1 }}>
                                                {item.paid ? (
                                                    item.discount > 0 && item.discount !== null ? (
                                                        <>
                                                            <Typography
                                                                component="span"
                                                                sx={{ fontWeight: '500', background: 'rgba(255, 215, 0, 0.6)', padding: '2px 5px', borderRadius: '4px' }}
                                                            >
                                                                ₹{(Number(item.price) - (Number(item.price) * (Number(item.discount) / 100))).toFixed(2)}
                                                            </Typography>
                                                            &nbsp; <s>₹{item.price}</s> &nbsp;
                                                            <Typography
                                                                component="span"
                                                                sx={{ color: 'red', fontWeight: 'bold' }}
                                                            >
                                                                -{item.discount}%
                                                            </Typography>
                                                        </>
                                                    ) : (
                                                        <>
                                                            {item.price !== null ?
                                                                <Typography
                                                                    component="span"
                                                                    sx={{ fontWeight: '500', background: 'rgba(255, 215, 0, 0.6)', padding: '2px 5px', borderRadius: '4px' }}
                                                                >
                                                                    ₹{parseFloat(item.price).toFixed(2)}
                                                                </Typography>
                                                                :
                                                                <Typography
                                                                    component="span"
                                                                    sx={{ fontWeight: '500', background: 'rgba(255, 215, 0, 0.6)', padding: '2px 5px', borderRadius: '4px' }}
                                                                >
                                                                    ₹0
                                                                </Typography>

                                                            }
                                                        </>
                                                    )
                                                ) : (
                                                    <Typography
                                                        component="span"
                                                        sx={{ fontWeight: '600', background: 'rgba(255, 215, 0, 0.6)', padding: '2px 5px', borderRadius: '4px' }}
                                                    >
                                                        Free
                                                    </Typography>
                                                )}
                                            </Box>
                                        </Box>
                                        <Box sx={{ position: "absolute", bottom: "0", left: 0, right: 0, padding: "0px 10px 0 10px" }}>
                                            <Grid2 container spacing={1}>

                                                <Grid2 item size={{ xs: 12, sm: 12, md: 12, lg: 12 }}>
                                                    <Button
                                                        onClick={() => handleAddtoCart(item)}
                                                        sx={{ background: "#0c858b", color: "#fff", margin: "10px 0px 10px 0px", width: "100%", fontWeight: "bold", fontSize: "10px" }}
                                                        className='addtocart-hover'
                                                    >
                                                        {cartCourses.some(a => a.id === item?.id) ? "Remove" : "Add to Cart"}

                                                    </Button>
                                                </Grid2>
                                            </Grid2>


                                        </Box>
                                    </Box>
                                </Grid2>
                            })
                        }
                    </Grid2>
                    {
                        filterCourseSubjectWise?.length > 0 && (
                            <Typography variant="h5" sx={{ fontWeight: "bold", color: "#000", mt: 6, mb: 2 }}>Subject Wise</Typography>
                        )
                    }
                    <Grid2 container sx={{ p: isMobile ? 1 : 0 }}>
                        {
                            filterCourseSubjectWise && filterCourseSubjectWise.map((item, i) => {
                                return <Grid2 item size={{ xs: 12, sm: 2.4, md: 2.4, lg: 2.4 }} sx={{ textAlign: "center", mb: 2, padding: isMobile ? "10px" : "" }}>
                                    <Box sx={{
                                        borderRadius: "10px", position: "relative", boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px",
                                        //  height: "300px"
                                    }}>
                                        <img
                                            alt={item?.title}
                                            src={endpointsUrl + item?.logo}
                                            style={{ width: "100%", minHeight: "120px", borderBottom: "1px solid #a9a9a92e", borderTopLeftRadius: "8px", borderTopRightRadius: "8px" }} />
                                        <Box sx={{ pb: 4, textAlign: "left", paddingLeft: "15px" }}>
                                            <Tooltip title={item?.title}>
                                                <Typography variant='h5' fontWeight={"bold"} sx={{ mt: 2, mb: 2, color: "black", fontSize: "15px" }}>
                                                    {item?.title?.split(" ").slice(0, 7).join(" ")}
                                                    {item?.title?.split(" ").length > 7 && "..."}
                                                </Typography>
                                            </Tooltip>
                                            <Typography variant='p' className='desktop-view-discrip' sx={{ fontSize: "12px" }}>
                                                {setCourseExpandedDescriptions === false ? truncateDescription(item?.description) : truncateDescription(item?.description)}
                                                {item?.description.length > 100 && (
                                                    <span style={{ color: 'blue', cursor: 'pointer', marginLeft: '5px', textDecoration: 'underline' }} onClick={() => toggleExpandDescription(item?.description)}>
                                                        {setCourseExpandedDescriptions ? 'more' : 'more'}
                                                    </span>
                                                )}
                                            </Typography>
                                            <Box sx={{ marginBottom: "20px", mt: 1 }}>
                                                {item.paid ? (
                                                    item.discount > 0 && item.discount !== null ? (
                                                        <>
                                                            <Typography
                                                                component="span"
                                                                sx={{ fontWeight: '500', background: 'rgba(255, 215, 0, 0.6)', padding: '2px 5px', borderRadius: '4px' }}
                                                            >
                                                                ₹{(Number(item.price) - (Number(item.price) * (Number(item.discount) / 100))).toFixed(2)}
                                                            </Typography>
                                                            &nbsp; <s>₹{item.price}</s> &nbsp;
                                                            <Typography
                                                                component="span"
                                                                sx={{ color: 'red', fontWeight: 'bold' }}
                                                            >
                                                                -{item.discount}%
                                                            </Typography>
                                                        </>
                                                    ) : (
                                                        <>
                                                            {item.price !== null ?
                                                                <Typography
                                                                    component="span"
                                                                    sx={{ fontWeight: '500', background: 'rgba(255, 215, 0, 0.6)', padding: '2px 5px', borderRadius: '4px' }}
                                                                >
                                                                    ₹{parseFloat(item.price).toFixed(2)}
                                                                </Typography>
                                                                :
                                                                <Typography
                                                                    component="span"
                                                                    sx={{ fontWeight: '500', background: 'rgba(255, 215, 0, 0.6)', padding: '2px 5px', borderRadius: '4px' }}
                                                                >
                                                                    ₹0
                                                                </Typography>

                                                            }
                                                        </>
                                                    )
                                                ) : (
                                                    <Typography
                                                        component="span"
                                                        sx={{ fontWeight: '600', background: 'rgba(255, 215, 0, 0.6)', padding: '2px 5px', borderRadius: '4px' }}
                                                    >
                                                        Free
                                                    </Typography>
                                                )}
                                            </Box>
                                        </Box>
                                        <Box sx={{ position: "absolute", bottom: "0", left: 0, right: 0, padding: "0px 10px 0 10px" }}>
                                            <Grid2 container spacing={1}>

                                                <Grid2 item size={{ xs: 12, sm: 12, md: 12, lg: 12 }}>
                                                    <Button
                                                        onClick={() => handleAddtoCart(item)}
                                                        sx={{ background: "#0c858b", color: "#fff", margin: "10px 0px 10px 0px", width: "100%", fontWeight: "bold", fontSize: "10px" }}
                                                        className='addtocart-hover'
                                                    >
                                                        {cartCourses.some(a => a.id === item?.id) ? "Remove" : "Add to Cart"}

                                                    </Button>
                                                </Grid2>
                                            </Grid2>


                                        </Box>
                                    </Box>
                                </Grid2>
                            })
                        }
                    </Grid2>

                </Grid2>
            </Grid2>
            <Dialog
                open={suggestedCourseDialog}
                onClose={() => setSuggestedCourseDialog(false)}
                sx={{
                    "& .MuiDialog-container": {
                        "& .MuiPaper-root": {
                            width: "100%",
                            maxWidth: "500px",
                        },
                    },
                }}
            >
                <SuggestedCourseDialog
                    addedSuggestCourse={addedSuggestCourse}
                    // courseId={course}
                    suggestedCourseId={suggestedCourseId}
                    handleClose={handleCloseSuggestedCourseDialog}
                    onFinalAmountUpdate={handleFinalAmountUpdate}
                    setCartCourses={setCartCourses} setFinalAmounts={setFinalAmounts}
                />
            </Dialog>
            <Dialog open={courseExpandedDescriptions} onClose={() => setCourseExpandedDescriptions(false)}>

                <DialogContent dividers>
                    <Typography variant='body1'>
                        {parse(fullDes)}
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setCourseExpandedDescriptions(false)}>Close</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};
