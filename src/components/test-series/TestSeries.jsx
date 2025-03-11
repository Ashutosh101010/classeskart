import { Box, Button, Card, Checkbox, Chip, Dialog, DialogActions, DialogContent, Divider, FormControl, FormHelperText, Grid, IconButton, InputAdornment, InputLabel, ListItemText, MenuItem, OutlinedInput, Select, Stack, Step, StepLabel, Stepper, styled, TextField, Typography, useMediaQuery } from '@mui/material';
import React, { useEffect, useRef, useState } from 'react'
import axios from 'axios';
import AddCircleIcon from "@mui/icons-material/AddCircle";
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import parse from "html-react-parser";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
// import ViewPlanModal from './AllPlans';
import CloseIcon from '@mui/icons-material/Close';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
// import { useNavigate, UNSAFE_NavigationContext } from "react-router-dom";
import { Base64 } from 'js-base64';
import Check from '@mui/icons-material/Check';
import PropTypes from 'prop-types';
import CheckIcon from '@mui/icons-material/Check';
import EnrolledNowForm from './EnrollNow';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';

const QontoStepIconRoot = styled('div')(({ theme, ownerState }) => ({
    color: theme.palette.mode === 'dark' ? theme.palette.grey[700] : '#eaeaf0',
    display: 'flex',
    height: 22,
    alignItems: 'center',
    ...(ownerState.active && {
        color: '#DD2A3D',
    }),
    '& .QontoStepIcon-completedIcon': {
        color: '#DD2A3D',
        zIndex: 1,
        fontSize: 18,
    },
    '& .QontoStepIcon-circle': {
        width: 12,
        height: 12,
        borderRadius: '50%',
        backgroundColor: 'currentColor',
    },
}));

function QontoStepIcon(props) {
    const { active, completed, className } = props;

    return (
        <QontoStepIconRoot ownerState={{ active }} className={className}>
            {completed ? (
                <Check className="QontoStepIcon-completedIcon" />
            ) : (
                <div className="QontoStepIcon-circle" />
            )}
        </QontoStepIconRoot>
    );
}

QontoStepIcon.propTypes = {
    /**
     * Whether this step is active.
     * @default false
     */
    active: PropTypes.bool,
    className: PropTypes.string,
    /**
     * Mark the step as completed. Is passed to child components.
     * @default false
     */
    completed: PropTypes.bool,
};

const steps = ['Plans', 'Details', 'Checkout', 'Done'];

export const TestSeries = () => {

    const responsive = {
        desktop: {
            breakpoint: { max: 3000, min: 1024 },
            items: 3,
            slidesToSlide: 3 // optional, default to 1.
        },
        tablet: {
            breakpoint: { max: 1024, min: 464 },
            items: 1,
            slidesToSlide: 1 // optional, default to 1.
        },
        mobile: {
            breakpoint: { max: 464, min: 0 },
            items: 2,
            slidesToSlide: 2 // optional, default to 1.
        }
    };

    const isMobileDevice = useMediaQuery('(min-width:480px)');
    const BASE_URL = "https://prodapi.classiolabs.com/";
    // let Endpoints = ''
    // const InstId = 119;
    // const InstId = 49;
    const InstId = 158;
    const location = useLocation();
    const navigate = useNavigate();
    const queryParam = new URLSearchParams(location.search);
    const campaignId = queryParam.get("campaignId");
    const params = useParams()
    const courseId = params.id;
    let paramData = queryParam?.get("data");
    // let data = JSON?.parse(Base64?.decode(paramData));
    let data = "";

    const selectCourserout = data.courseObj;
    const cartRouteData = location?.state?.cartRoute;
    const [error, setError] = useState('');
    const [selectCourse, setSelectCourse] = useState('');
    const [selectedTag, setSelectedTag] = useState('');
    const [course, setCourse] = useState([]);
    const [filterCourse, setFilterCourse] = useState([]);
    const [suggestedCourse, setSuggestedCourse] = useState([]);
    const [tagsList, setTagsList] = useState([]);
    const [courseContentList, setCourtseContentList] = useState([]);
    const [selectShedule, setSelectShedule] = useState('');
    const [schedule, setSchedule] = useState('');
    const [activeStep, setActiveStep] = useState(0);
    const [completed, setCompleted] = useState({});
    const [title, setTitle] = useState('');
    const [number, setNumber] = useState('');
    const [email, setEmail] = useState('');
    const [addSuggestCourse, setAddSuggestCourse] = useState(false);
    const [selectedIds, setSelectedIds] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);
    const [purchaseArray, setPurchaseArray] = useState([]);
    const [skipped, setSkipped] = useState(new Set());
    const [alltreeList, setAlltreeList] = useState([]);
    const [sheduleContentList, setSheduleContentList] = useState([]);
    const [activeBtn, setActiveBtn] = useState('both');
    const [selectSubjectWise, setSelectSubjectWise] = useState([]);
    const [subjectWiseListRender, setSubjectWiseListRender] = useState([]);
    const [plansList, setPlansList] = useState([]);
    const [peviewImgVideo, setPeviewImgVideo] = useState({});
    const [checked, setChecked] = useState(false);
    const [coursePublic, setCoursesPublic] = useState({});
    const [orderBumpCourse, setOrderBumpCourse] = useState({});
    const [viewPlanModal, setViewPlanModal] = useState(false);
    const [Endpoints, setEndpoints] = useState('')
    const [addtoCartIds, setAddtoCartIds] = useState([]);
    const [addedCartPlans, setAddedCartPlans] = useState([]);
    const [courseExpandedDescriptions, setCourseExpandedDescriptions] = useState(false);
    const [fullDes, setFullDes] = useState('');
    const [filterGroupSubject, setFilterGroupSubject] = useState('group');
    const [openScheduleModal, setOpenScheduleModal] = useState(false);
    const [couponNumber, setCouponNumber] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [isCouponValid, setIsCouponValid] = useState(null);
    const [couponDiscount, setCouponDiscount] = useState(0);
    const [reedemCode, setReedemCode] = useState(false);
    const [cartArray, setCartArray] = useState([]);
    const [enrolledNowModal, setEnrolledNowModal] = useState(false);
    const [thankyouModal, setThankyouModal] = useState(false);

    // console.log('purchaseArray', purchaseArray);
    // console.log('course', course);
    // console.log('selectCourse', selectCourse);

    const childRef = useRef();
    const cartNumberUpdate = () => {
        if (childRef.current !== null || childRef.current !== undefined) {
            try {
                childRef.current.update();
            } catch (error) {
                console.log(error);
            }

        }

    }

    useEffect(() => {
        const allEntityIds = [];
        let totalPrice = 0;
        cartArray?.forEach((item) => {
            const object = getPlanPrice(item.plan, item.group, item.subject);
            let price = object?.price;
            totalPrice += object?.finalPrice === 0 ? Number(price) - (Number(price / 100) * Number(item?.plan?.discount)) : object?.finalPrice;
            object.entityId.forEach((entity) => {
                allEntityIds.push(entity);
            });
        });
        setTotalPrice(totalPrice)
        setPurchaseArray(allEntityIds);
        localStorage.setItem("purchaseArray", JSON.stringify(allEntityIds));
    }, [cartArray]);

    useEffect(() => {
        if (coursePublic?.id) {
            const matchedEntity = purchaseArray.some(purchase => purchase.entityId === coursePublic.id);
            if (matchedEntity) {
                setOrderBumpCourse({})
            } else {
                setOrderBumpCourse(coursePublic)
            }

        }
    }, [coursePublic])
    const updateCartAndPurchaseArrays = (plansList, addedCartPlans) => {
        //     const matchedPlans = [];
        //     const newAddtoCartIds = [];
        let newPurchaseArray = [];

        addedCartPlans.forEach(cartItem => {
            plansList.forEach(plan => {
                if (cartItem.plan.title === plan.title) {
                    let object = getPlanPrice(plan, cartItem.group, cartItem.subject);
                    cartItem.plan = plan;
                    newPurchaseArray.push(cartItem);
                }
            })

        })
        setCartArray(newPurchaseArray);
    };

    useEffect(() => {
        if (activeStep === -1) {
            navigate("/")
        }
    })

    useEffect(() => {
        if (filterCourse?.length > 0 && courseId) {
            const selectedCourse = filterCourse.find(course => Number(course.id) === Number(courseId));

            if (selectedCourse) {
                setSelectCourse(selectedCourse);
                const newUrl = `?name=${encodeURIComponent(selectedCourse.title)}`;
                navigate(newUrl, { replace: true });
            }
        }
    }, [filterCourse, courseId])

    function initial() {
        getCourseList();
        getTagsList();
        getInstituteDetail();
        // setSelectCourse(selectCourserout)

        if (data['selectedTag'] !== undefined) {
            setSelectedTag(JSON.parse(data['selectedTag']));
        }

        if (data['selectCourse'] !== undefined) {
            setSelectCourse(JSON.parse(data['selectCourse']));
        }

        if (data['activeStep'] !== undefined) {
            setActiveStep(data['activeStep']);
        }
        if (data['schedule'] !== undefined) {
            setSchedule(JSON.parse(data['schedule']));
        }
        if (data['activeBtn'] !== undefined) {
            setActiveBtn(data['activeBtn']);
        }
        if (data['selectSubjectWise'] !== undefined) {
            setSelectSubjectWise(JSON.parse(data['selectSubjectWise']));
        }
        if (data['addtoCartIds'] !== undefined) {
            setAddtoCartIds(JSON.parse(data['addtoCartIds']));
        }
        if (data['addedCartPlans'] !== undefined) {
            setAddedCartPlans(JSON.parse(data['addedCartPlans']));
        }
        if (data['purchaseArray'] !== undefined) {
            setPurchaseArray(JSON.parse(data['purchaseArray']));
        }
    }

    useEffect(() => {
        window.scrollTo(0, 0)
        initial();
        window.onpopstate = () => {
            handleBackBrowserBack();
            initial();
        }

        const localPlans = localStorage.getItem('addedCartPlans');
        const locaPurchase = localStorage.getItem('purchaseArray');
        const localPlansIds = localStorage.getItem('addtoCartIds');
        if (localPlans !== undefined && locaPurchase !== null) {
            setAddedCartPlans(JSON.parse(localPlans));
        }
        if (localPlansIds !== undefined && locaPurchase !== null) {
            setAddtoCartIds(JSON.parse(localPlansIds));
        }
        if (locaPurchase !== undefined && locaPurchase !== null) {
            setPurchaseArray(JSON.parse(locaPurchase));
        }
        if (cartRouteData === "cartRoute") {
            setActiveStep(1)
            const localCartArray = localStorage.getItem('cartArray');
            if (localCartArray !== undefined && localCartArray !== null) {
                setCartArray(JSON.parse(localCartArray));
            }
        }

    }, []);

    function handleBackBrowserBack() {
        handleBack();
    }

    useEffect(() => {
        if (selectCourse) {
            const filterCourseTags = course.filter(item => {
                const tagslists = item.tags || [];
                if (tagslists.some(tag => tag.id === selectCourse?.setting?.checkoutTag)) {
                    return item
                }
            });

            setSuggestedCourse(filterCourseTags);
        }
    }, [selectCourse, course])

    useEffect(() => {
        // if (selectedTag) {
        //     const filterCourseTags = course.filter(item => {
        //         const tagslists = item.tags || [];
        //         if (tagslists.some(tag => tag.id === selectedTag.id)) {
        //             return item
        //         }
        //     });
        //     setFilterCourse(filterCourseTags);
        // }
        setFilterCourse(course)
    }, [selectedTag, course])

    useEffect(() => {
        if (courseContentList && courseContentList.length > 0) {
            const firstItem = courseContentList[0];
            setSchedule(firstItem);
            // setSelectShedule(firstItem);
            getSheduleContentList(selectCourse?.id, firstItem.id);
        } else {
            setSchedule("");
            // setSelectShedule('');
        }
    }, [courseContentList])

    useEffect(() => {
        if (selectCourse?.id) {
            getCourseContentList(selectCourse?.id)
        }
    }, [selectCourse]);

    useEffect(() => {
        if (schedule?.id) {
            setSelectShedule(schedule);
            fetchDripContent(schedule?.id);
        }
    }, [schedule])

    useEffect(() => {
        if (alltreeList?.length > 0) {
            // setActiveBtn('both')
            getPlans('both');
        }
    }, [alltreeList])

    useEffect(() => {
        getPlans(activeBtn);
    }, [selectSubjectWise, activeBtn])

    function getPlans(selectBtnType) {
        let plans = [];
        let subjectTempList = [];
        alltreeList.forEach((plan) => {
            if (selectBtnType === 'group1') {
                if (plan.children?.length > 0) {
                    plan.children.forEach((group) => {
                        if (group.title === 'Group 1') {
                            if (!checkPlansExists(plans, plan.title)) {
                                plans.push(plan);
                            }
                            if (group?.children?.length > 0) {
                                group.children.forEach((subject) => {
                                    if (!checkSubjectExists(subjectTempList, subject.title)) {
                                        subjectTempList.push(subject);
                                    }
                                })
                            }
                        }
                    })
                }
            }
            if (selectBtnType === 'group2') {
                if (plan.children?.length > 0) {
                    plan.children.forEach((group) => {
                        if (group.title === 'Group 2') {
                            if (!checkPlansExists(plans, plan.title)) {
                                plans.push(plan);
                            }
                            if (group?.children?.length > 0) {
                                group.children.forEach((subject) => {
                                    if (!checkSubjectExists(subjectTempList, subject.title)) {
                                        subjectTempList.push(subject);
                                    }
                                })
                            }
                        }
                    })
                }
            }
            if (selectBtnType === 'both') {
                if (plan.children?.length > 0) {
                    plan.children.forEach((group) => {
                        if (group.title === 'Group 2' || group.title === 'Group 1') {
                            if (!checkPlansExists(plans, plan.title)) {
                                plans.push(plan);
                            }
                            if (group?.children?.length > 0) {
                                group.children.forEach((subject) => {
                                    if (!checkSubjectExists(subjectTempList, subject.title)) {
                                        subjectTempList.push(subject);
                                    }
                                })
                            }
                        }
                    })
                }
            }
            if (selectSubjectWise.length > 0) {
                plans = filterPlansOnSelectedSubject(plans, selectSubjectWise);

            }
        })
        setSubjectWiseListRender(subjectTempList);
        setPlansList(plans);
    }


    function checkSubjectExists(subjectList, title) {

        let exists = false;
        subjectList.forEach((subject) => {
            if (subject.title === title) {
                exists = true;
            }
        })
        return exists;
    }
    function checkPlansExists(plansList, title) {

        let exists = false;
        plansList?.forEach((plan) => {
            if (plan.title === title) {
                exists = true;
            }
        })
        return exists;
    }

    function filterPlansOnSelectedSubject(plans, selectedSubjects) {
        let planList = [];
        plans?.forEach((plan) => {
            plan?.children?.forEach((group) => {
                group?.children?.forEach((subject) => {
                    selectedSubjects?.forEach((selectedSubject) => {
                        if (selectedSubject.title === subject.title && !checkPlansExists(planList, plan.title)) {
                            planList.push(plan);
                        }
                    })
                })
            })
        })
        return planList;
    }

    function filterSelectedSubjectListByGroup(group, sltSubject) {
        let selectedSubject = [];
        if (sltSubject?.length > 0) {
            sltSubject?.forEach((subject) => {
                if (group?.children?.length > 0) {
                    group?.children?.forEach((subjectGroup) => {
                        if (subject?.title === subjectGroup?.title) {
                            selectedSubject.push(subjectGroup);
                            // entityIdArrays.push({
                            //     purchaseType: "courseContent",
                            //     entityId: subjectGroup?.entityId
                            // })

                        }
                    })
                }

            })
        }
        return selectedSubject;
    }

    function filterSelectedSubjectListByPlan(plan, sltSubject) {
        let selectedSubject = [];
        if (sltSubject?.length > 0) {
            sltSubject?.forEach((subject) => {
                plan.children.forEach((group) => {
                    if (group?.children?.length > 0) {
                        group?.children?.forEach((subjectGroup) => {
                            if (subject?.title === subjectGroup?.title) {
                                selectedSubject.push(subjectGroup);
                            }
                        })
                    }
                })
            })
        }
        return selectedSubject;
    }

    function getPlanPrice(plan, selectedGroup, sltSubject) {
        let price = 0;
        // let discount = 0;
        let finalPrice = 0;
        let entityId = []
        let thumbLogo = ''
        if (selectedGroup === 'both') {
            let totalSubject = 0;
            let selectedSubject = filterSelectedSubjectListByPlan(plan, sltSubject);
            plan?.children.forEach((group) => {
                if (group?.children?.length > 0) {
                    group?.children.forEach((subject) => {
                        totalSubject += 1
                    })
                }
            })
            if (selectedSubject.length === totalSubject || selectedSubject.length === 0) {
                price = plan?.price;
                thumbLogo = plan?.description?.thumb;
                // discount = plan?.discount;
                finalPrice += plan?.price - ((plan?.price / 100) * plan?.discount);
                entityId.push({
                    purchaseType: "courseContent",
                    entityId: plan?.entityId
                })
            } else {
                plan?.children.forEach((group) => {
                    let allSubjectSelectOfGroup = false;
                    let groupSelectedSubject = 0;
                    let selectedOfGroup = [];
                    group?.children?.forEach((subject) => {
                        if (selectedSubject?.length > 0) {
                            selectedSubject.forEach((selectedSubject) => {
                                totalSubject += 1;
                                if (subject?.title === selectedSubject?.title) {
                                    selectedOfGroup.push(selectedSubject);
                                    groupSelectedSubject += 1;

                                    if (groupSelectedSubject === group?.children?.length) {
                                        allSubjectSelectOfGroup = true;
                                    }
                                }
                            })
                        }
                    })

                    if (allSubjectSelectOfGroup && groupSelectedSubject > 0) {
                        price += group?.price;
                        finalPrice += group?.price - ((group?.price / 100) * group?.discount);
                        thumbLogo = selectedOfGroup[0]?.description?.thumb;
                        // discount += selectedSubject?.discount;
                        entityId.push({
                            purchaseType: "courseContent",
                            entityId: group?.entityId
                        })
                    } else {
                        // thumbLogo = plan?.description?.thumb;
                        selectedOfGroup.forEach((selectedSubject) => {
                            price += selectedSubject?.price;
                            finalPrice += selectedSubject?.price - ((selectedSubject?.price / 100) * selectedSubject?.discount);
                            thumbLogo = selectedOfGroup[0]?.description?.thumb;
                            // discount += selectedSubject?.discount;
                            entityId.push({
                                purchaseType: "courseContent",
                                entityId: selectedSubject?.entityId
                            })
                        })
                    }
                })
            }

        }
        else if (selectedGroup === 'group1') {
            plan?.children.forEach((group) => {
                if (group?.title === 'Group 1') {
                    price = group?.price;
                    thumbLogo = group?.description?.thumb;
                    finalPrice += group?.price - ((group?.price / 100) * group?.discount);
                    // discount = group?.discount;
                    entityId.push({
                        purchaseType: "courseContent",
                        entityId: group?.entityId
                    })
                    let selectedSubject = filterSelectedSubjectListByGroup(group, sltSubject);
                    if (selectedSubject?.length > 0 && selectedSubject.length !== group.children.length) {
                        price = 0;
                        // discount = 0;
                        finalPrice = 0;
                        entityId = [];
                        selectedSubject.forEach((selectedSubject) => {
                            price += selectedSubject?.price;
                            // discount += selectedSubject?.discount;
                            finalPrice += selectedSubject?.price - ((selectedSubject?.price / 100) * selectedSubject?.discount);

                            entityId.push({
                                purchaseType: "courseContent",
                                entityId: selectedSubject?.entityId
                            })
                        })
                    }
                }
            })
        }

        else if (selectedGroup === 'group2') {
            plan?.children.forEach((group) => {
                if (group?.title === 'Group 2') {
                    price = group?.price;
                    thumbLogo = group?.description?.thumb;
                    finalPrice += group?.price - ((group?.price / 100) * group?.discount);
                    // discount = group?.discount;
                    entityId.push({
                        purchaseType: "courseContent",
                        entityId: group?.entityId
                    })
                    let selectedSubject = filterSelectedSubjectListByGroup(group, sltSubject);
                    if (selectedSubject?.length > 0 && selectedSubject.length !== group.children.length) {
                        price = 0;
                        // discount = 0;
                        entityId = [];
                        finalPrice = 0;
                        selectedSubject.forEach((selectedSubject) => {
                            price += selectedSubject?.price;
                            // discount += selectedSubject?.discount;
                            finalPrice += selectedSubject?.price - ((selectedSubject?.price / 100) * selectedSubject?.discount);

                            entityId.push({
                                purchaseType: "courseContent",
                                entityId: selectedSubject?.entityId
                            })
                        })
                    }
                }
            })
        }
        let discount = price - finalPrice;
        let percent = discount > 0 ? (((discount) / price) * 100).toFixed(2) : 0;

        return { "price": price, "finalPrice": finalPrice, "entityId": entityId, "thumbLogo": thumbLogo, "discount": discount, "percent": percent };

    }
    const getTagsList = async () => {
        try {
            let requestOptions = {
                // headers: { "X-Auth": token },
                withCredentials: false,
            };
            const response = await axios.get(BASE_URL + "admin/course/fetch-tags-public/" + InstId, requestOptions);
            if (response?.data?.errorCode === 0) {
                setTagsList(response?.data?.tags)
                let selectedSeriesByTitle = response?.data?.tags;
                const testByTitle = selectedSeriesByTitle.find(
                    (item) => item.tag
                );
                setSelectedTag(testByTitle)
            };

        } catch (error) {
            console.log(error);
        }
    };

    const getCourseList = async () => {
        try {
            let requestOptions = {
                // headers: { "X-Auth": token },
                withCredentials: false,
            };
            const response = await axios.get(BASE_URL + "admin/course/fetch-public/" + InstId, requestOptions);
            if (response?.data?.errorCode === 0) {
                setCourse(response?.data?.courses);
            };
        } catch (error) {
            console.log(error);
        }
    };

    const fetchDripContent = async (scheduleId) => {
        try {
            let requestOptions = {
                // headers: { "X-Auth": token },
                withCredentials: false,
            };
            const response = await axios.get(BASE_URL + `/admin/content/fetch-drip-content/${scheduleId}`, requestOptions);

            if (response?.data?.errorCode === 0) {
                setAlltreeList(response?.data?.content)
                updateCartAndPurchaseArrays(response?.data?.content, cartArray)
            };
        } catch (error) {
            console.log(error);
        }
    }

    const getAllCoursesPublic = async () => {
        try {
            let requestOptions = {
                // headers: { "X-Auth": token },
                withCredentials: false,
            };
            const response = await axios.get(
                BASE_URL + "admin/course/fetch/" + selectCourse?.setting?.orderBumpCourse,
                requestOptions
            );
            if (response?.data?.errorCode === 0) {

                setCoursesPublic(response?.data?.course);

            };
        } catch (error) {
            console.log(error);
        }
    };

    const getInstituteDetail = async () => {
        try {
            let requestOptions = {
                // headers: { "X-Auth": token },
                withCredentials: false,
            };
            const response = await axios.get(
                BASE_URL + "/getMetaData/fetch-institute/" + InstId,
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

    const isStepSkipped = (step) => {
        return skipped.has(step);
    };

    const totalSteps = () => {
        return steps.length;
    };

    const completedSteps = () => {
        return Object.keys(completed).length;
    };

    const isLastStep = () => {
        return activeStep === totalSteps() - 1;
    };

    const allStepsCompleted = () => {
        return completedSteps() === totalSteps();
    };

    const handleNext = () => {
        const newActiveStep = isLastStep() && !allStepsCompleted() ? steps.findIndex((step, i) => !(i in completed)) : activeStep + 1;
        setActiveStep(newActiveStep);
    };

    const handleBack = () => {
        setPeviewImgVideo({})
        setActiveStep((prevActiveStep) => prevActiveStep - 1);

    };

    const handleReset = () => {
        setActiveStep(0);
        setCompleted({});
    };

    useEffect(() => {
        localStorage.setItem("addedCartPlans", JSON.stringify(addedCartPlans));
        // localStorage.setItem("purchaseArray", JSON.stringify(purchaseArray));
        localStorage.setItem("addtoCartIds", JSON.stringify(addtoCartIds));
        localStorage.setItem("selectCourse", JSON.stringify(selectCourse));

        // cartNumberUpdate()

    }, [addedCartPlans, purchaseArray, addtoCartIds, selectCourse])

    // console.log('cartArray', cartArray);

    const handleEnrollNow = (item) => {
        // console.log('item', item);
        // console.log('cartArray', cartArray);


        const id = item.id;
        const isSelected = cartArray.some(cartItem => cartItem.plan.id === id); // Check if the item is already in the cart

        if (isSelected) {
            // Remove the item from the cart
            const updatedCartArray = cartArray.filter(cartItem => cartItem.plan.id !== id);
            setCartArray(updatedCartArray);
            localStorage.setItem("cartArray", JSON.stringify(updatedCartArray));
            // cartNumberUpdate()
        } else {
            // Add the item to the cart
            const obj = {
                group: activeBtn,
                subject: selectSubjectWise,
                plan: item
            };
            const updatedCartArray = [...cartArray, obj];
            setCartArray(updatedCartArray);
            localStorage.setItem("cartArray", JSON.stringify(updatedCartArray));
            // cartNumberUpdate()
        }
        setEnrolledNowModal(true)
    };

    // console.log('activeBtn', activeBtn);



    function handleNextBrowse() {

        data['selectedTag'] = JSON.stringify(selectedTag);
        data['selectCourse'] = JSON.stringify(selectCourse);
        data['activeStep'] = activeStep;
        data['schedule'] = JSON.stringify(schedule);
        data['activeBtn'] = activeBtn;
        data['selectSubjectWise'] = JSON.stringify(selectSubjectWise);
        data['addtoCartIds'] = JSON.stringify(addtoCartIds);
        data['addedCartPlans'] = JSON.stringify(addedCartPlans);
        data['purchaseArray'] = JSON.stringify(purchaseArray);
        navigate('/test-series?data=' + Base64.encode(JSON.stringify(data), true));
    }
    const handleShowCart = () => {
        const newActiveStep = isLastStep() && !allStepsCompleted() ? steps.findIndex((step, i) => !(i in completed)) : activeStep + 1;


        handleNextBrowse();

        setActiveStep(newActiveStep);
        window.scrollTo(0, 0)


    }

    const handleAddToCard = () => {
        if (courseContentList?.length > 1) {
            setOpenScheduleModal(true);
        } else {
            const newActiveStep = isLastStep() && !allStepsCompleted() ? steps.findIndex((step, i) => !(i in completed)) : activeStep + 1;
            handleNextBrowse()
            setActiveStep(newActiveStep);
            getAllCoursesPublic()
        }

    }

    const handleCheckoutSubmit = () => {
        const newActiveStep = isLastStep() && !allStepsCompleted() ? steps.findIndex((step, i) => !(i in completed)) : activeStep + 1;
        handleNextBrowse()
        setActiveStep(newActiveStep);
        getAllCoursesPublic()
        setOpenScheduleModal(false);
    }

    const handleAddCourse = (item) => {
        const coursePrice = Number(item?.price) - Number(item?.price) * (Number(item.discount) / 100);
        const id = item.id;
        const purchaseObject = {
            purchaseType: "course",
            entityId: id,
        };
        const updatedPurchaseObjects = [...purchaseArray];
        const isSelected = selectedIds.includes(id);

        if (isSelected) {
            setTotalPrice((prevTotalPrice) => prevTotalPrice - coursePrice);
            setSelectedIds(selectedIds.filter((selectedId) => selectedId !== id));
            const indexToRemove = updatedPurchaseObjects.findIndex((obj) => obj.entityId === id);
            updatedPurchaseObjects.splice(indexToRemove, 1);
        } else {
            setTotalPrice((prevTotalPrice) => prevTotalPrice + coursePrice);
            setSelectedIds([...selectedIds, id]);
            updatedPurchaseObjects.push(purchaseObject);
        }
        setPurchaseArray(updatedPurchaseObjects);
        setAddSuggestCourse(!addSuggestCourse);
    };


    const getCourseContentList = async (courseId) => {
        try {
            let requestOptions = {
                // headers: { "X-Auth": token },
                withCredentials: false,
            };
            const response = await axios.get(BASE_URL + `admin/course/fetchContent-public/${courseId}/0`, requestOptions);
            if (response?.data?.errorCode === 0) {
                let filterCourseContent = response?.data?.contentList;
                let filterDripCourse = filterCourseContent.filter((data) => data?.drip === true);


                setCourtseContentList(filterDripCourse);
            };
        } catch (error) {
            console.log(error);
        }
    }

    const getSheduleContentList = async (courseId, contentId) => {
        try {
            let requestOptions = {
                // headers: { "X-Auth": token },
                withCredentials: false,
            };
            const response = await axios.get(BASE_URL + `admin/course/fetchContent-public/${courseId}/${contentId}`, requestOptions);
            if (response?.data?.errorCode === 0) {
                let filterCourseContent = response?.data?.contentList;
                setSheduleContentList(filterCourseContent);
            };
        } catch (error) {
            console.log(error);
        }
    }

    const handleChangeCours = (event) => {
        setPurchaseArray([])
        setPeviewImgVideo({})
        setPlansList([])
        setAddedCartPlans([]);
        setAddtoCartIds([]);
        setPurchaseArray([]);
        setSelectedIds([]);
        setSelectSubjectWise([]);
        setActiveStep(0);
        let courseId = event?.target?.value?.id
        setSelectCourse(event.target.value);
        getCourseContentList(courseId);
    };

    const handleTags = (event) => {
        setPeviewImgVideo({})
        setSelectCourse('')
        setActiveStep(0)
        let courseId = event?.target?.value?.id
        setSelectedTag(event.target.value);
        getCourseList()
    };

    const handleChange = (event) => {
        const selectedValue = event.target.value;
        const selectedObject = courseContentList.find(item => item.title === selectedValue?.title);
        setSelectShedule(selectedValue)
        getSheduleContentList(selectCourse?.id, selectedObject?.id);
        fetchDripContent(selectedValue?.id)
        // setPlansList([])
    };

    const handleButtonClick = (value) => {
        setCartArray([])
        setSelectSubjectWise([]);
        setActiveStep(0);
        setActiveBtn(value);
        getPlans(value);
    }

    const handleSubjectWise = (event) => {
        const {
            target: { value },
        } = event;
        setSelectSubjectWise(typeof value === 'string' ? value.split(',') : value);
    };

    const handleSubmit = async () => {
        const body = {
            "firstName": title,
            "lastName": title,
            "contact": number,
            "email": email,
            "campaignId": campaignId,
            "instId": InstId,
            "entityModals": purchaseArray,
            "coupon": isCouponValid === true ? couponNumber : null
        }
        try {
            const response = await axios.post(BASE_URL + `/admin/payment/fetch-public-checkout-url`, body);

            if (response?.data?.status === true) {

                const width = 480;
                const height = 1080;
                const left = window.screenX + (window.outerWidth / 2) - (width / 2);
                const top = window.screenY + (window.outerHeight / 2) - (height / 2);

                window.open(
                    response?.data?.url,
                    'sharer',
                    `location=no,width=${width},height=${height},top=${top},left=${left}`
                );

                // window.open(response?.data?.url, '_blank', "noopener,noreferrer");
                // window.open(response?.data?.url, 'sharer', "location=no,width=480,height=1080");

                setTitle('');
                setNumber('');
                setEmail('')
                setCartArray([])
                // localStorage.removeItem('cartArray')
                localStorage.setItem("cartArray", JSON.stringify([]));

                // handleDrawerClose()
            }
            const newActiveStep = isLastStep() && !allStepsCompleted() ? steps.findIndex((step, i) => !(i in completed)) : activeStep + 1;
            setActiveStep(newActiveStep);
            setEnrolledNowModal(false)
            setThankyouModal(true)
            cartNumberUpdate()
        } catch (err) {
            console.log(err);
        };

    };

    const handlePreview = (url, type, itemId) => {
        setPeviewImgVideo((prev) => ({ ...prev, [itemId]: { url, type } }));
    };

    const handleCheckboxChange = () => {
        setChecked(!checked);

        if (!checked) {
            // Add the object when checked
            setPurchaseArray((prevArray) => [
                ...prevArray,
                {
                    purchaseType: "course",
                    entityId: Number(orderBumpCourse?.id),
                }
            ]);
        } else {
            // Remove the object when unchecked
            setPurchaseArray((prevArray) =>
                prevArray.filter(
                    (item) => item.entityId !== Number(orderBumpCourse?.id)
                )
            );
        }
    };

    const handleViewPlan = () => {
        setViewPlanModal(true)
    }

    const handleRemoveItem = (item, i) => {
        let temp = [];
        cartArray.forEach((item, x) => {
            if (x !== i) {
                temp.push(item)
            }
        })
        setCartArray(temp);
        localStorage.setItem('cartArray', JSON.stringify(temp));
        if (temp?.length === 0) {
            setActiveStep(0)
        }
        cartNumberUpdate()
    }

    const toggleExpandDescription = (des) => {
        setFullDes(des)
        setCourseExpandedDescriptions(true);
    };

    const truncateDescription = (description) => {
        // Replace &nbsp; and other HTML entities with plain text equivalents
        const decodedDescription = description?.replace(/&nbsp;/g, ' ')
            ?.replace(/&amp;/g, '&') // Example for handling other entities, can add more if needed
            ?.replace(/&lt;/g, '<')
            ?.replace(/&gt;/g, '>')
            ?.replace(/&quot;/g, '"')
            ?.replace(/&#39;/g, "'");

        // Strip any remaining HTML tags
        const strippedDescription = decodedDescription
            ?.replace(/<[^>]*>/g, ' ') // Remove HTML tags
            ?.split(/\s+/)
            ?.slice(0, 10) // Get first 10 words
            ?.join(' ');

        return strippedDescription;
    };

    const chipTitle = (title) => {
        const first10Words = title
            .split(' ')
            .slice(0, 3)
            .join(' ');
        return first10Words;
    }
    const handleSelectSub = () => {
        setActiveBtn("both")
    }

    const handleNumberChange = (e) => {
        const value = e.target.value;
        if (/^\d*$/.test(value) && value.length <= 10) {
            setNumber(value);
            setError('');
            if (value.length < 10) {
                setError('Number must be 10 digits long');
            }
        }
    };


    const handleFilter = (value) => {
        setCartArray([])
        if (value === "group") {
            setSelectSubjectWise([])
            setActiveBtn(activeBtn)
        } else if (value === "subject") {
            setActiveBtn("both")
        }
        setFilterGroupSubject(value);
    }

    const handleCheckCoupon = async (e) => {
        e.preventDefault();
        const body = {
            "getCheckoutUrls": purchaseArray,
            "coupon": couponNumber,
            "contact": Number(number),
            "instId": InstId,
            "amount": checked ? (orderBumpCourse.price - ((orderBumpCourse.price / 100) * orderBumpCourse.discount)) + totalPrice : (totalPrice)
        }
        try {
            const response = await axios.post(BASE_URL + `/student/coupon/verify`, body);
            // const response = await CourseNetwrok.checkCouponApi(body);
            if (response.data.errorCode === 0) {
                setCouponDiscount(response.data?.discount);
                setIsCouponValid(response.data?.valid);
                setErrorMessage("");
            } else {
                setIsCouponValid(response.data?.valid === null ? false : response.data?.valid);
                setErrorMessage(response.data?.message ? response.data?.message : "Invalid Coupon Code");
                setCouponDiscount(0)
                // setErrorMessage("Invalid Coupon Code")
            }
        } catch (err) {
            console.log(err);
        };
    };

    const handleCoupon = (e) => {
        setCouponNumber(e.target.value);
        setErrorMessage('');
        setIsCouponValid(null);
    }

    const getColor = () => {
        if (isCouponValid === null) return 'darkblue';
        return isCouponValid ? '#329908' : 'red';
    };

    const handleReedemCode = () => {
        setReedemCode(!reedemCode)
    }

    const handleWhatsappClick = () => {
        setThankyouModal(false)
        window.open("https://wa.me/+918440930809", "_blank");
    }

    console.log('filterCourse', filterCourse);
    console.log('selectedCourse', selectCourse);



    return (
        <div className="test-series" style={{ textAlign: 'left' }}>
            <div className="row" style={{ margin: 0 }}>
                <div className="col-xs-12 col-md-12 col-lg-12">
                    <Box sx={{ display: 'flex', flexDirection: 'row', pb: 2, mt: 3 }}>
                        {/* <Button
                            color="inherit"
                            // disabled={activeStep === 0}
                            onClick={handleBack}
                            sx={{ mr: 1, fontWeight: "bold", fontSize: "14px" }}
                        >
                            <ArrowBackIcon /> &nbsp; Back
                        </Button> */}
                        <Box sx={{ flex: '1 1 auto' }} />
                    </Box>
                    <div>
                        <h2 className='mobile-text-high' style={{
                            textTransform: "initial",
                            display: "flex", alignItems: "center", textAlign: "left", fontWeight: "bold", marginBottom: "15px", justifyContent: "left",
                        }}>Highly Rated Test Series Programs</h2>
                        {/* <p sx={{ mb: 3 }}>Crack CA-CS with Our Trusted and Most Loved Test Series.</p> */}
                    </div>

                    <Grid container>
                        <Grid item xs={12} sm={12} md={12} lg={12} sx={{ mb: 4 }}>
                            <Typography variant='h6' sx={{ color: "black", fontWeight: 'bold', mb: 1 }}>{selectCourse?.title}</Typography>
                            <Typography variant='p' sx={{}}>{selectCourse?.shortDescription}</Typography>
                        </Grid>
                        <Grid item xs={12} sm={12} md={12} lg={12}>
                            <Box>
                                <img className='course-img-video' src={selectCourse?.logo ? Endpoints + selectCourse?.logo : ""} style={{ height: "100%", padding: '5px', borderRadius: "10px" }} />
                            </Box>
                        </Grid>
                        {/* <Grid item xs={12} sm={4} md={4} lg={4}>
                            <video controls src={selectCourse?.introVideo ? Endpoints + selectCourse?.introVideo : ''} className='course-img-video' style={{ height: "200px", padding: '5px' }} onClick={() => handlePreview(selectCourse?.introVideo ? Endpoints + selectCourse?.introVideo : '', 'video', selectCourse?.id)} />
                        </Grid> */}
                        <Grid item xs={12} sm={12} md={12} lg={12} sx={{ mb: 4, mt: 4 }}>
                            <Typography variant='p' sx={{}}>{selectCourse?.description ? parse(selectCourse?.description) : ""}</Typography>
                        </Grid>
                    </Grid>
                    <Divider sx={{ background: "#80808000", width: "100%" }} />

                    {/* <Grid container sx={{ pt: 2, pb: 4 }}>
                        <Grid item xs={12} sm={8} md={8} lg={8}>
                            <Stack direction={"row"} spacing={3} className='stack-mobile'>
                                {activeStep === 0 && (
                                    <>
                                        <FormControl className='mobile-select-button'>
                                            <InputLabel id="demo-simple-select-label" sx={{ fontSize: "13px" }}>Select Exam</InputLabel>
                                            <Select
                                                className='select-option'
                                                sx={{ mb: 2, width: 250, fontSize: "12px" }}
                                                labelId="demo-simple-select-label"
                                                id="demo-simple-select"
                                                value={selectedTag}
                                                label="Select Exam"
                                                onChange={handleTags}
                                            >
                                                {
                                                    tagsList && tagsList.map((data, index) => {
                                                        return (
                                                            <MenuItem key={index} value={data}>{data?.tag}</MenuItem>
                                                        )
                                                    })
                                                }
                                            </Select>
                                        </FormControl>
                                        <FormControl className='mobile-select-button'>
                                            <InputLabel id="demo-simple-select-label" sx={{ fontSize: "13px" }}>Select Course</InputLabel>
                                            <Select
                                                className='select-option'
                                                sx={{ mb: 2, width: 250, fontSize: "12px" }}
                                                labelId="demo-simple-select-label"
                                                id="demo-simple-select"
                                                renderValue={(val) => <div>{val.title}</div>}
                                                value={selectCourse}

                                                label="Select Course"
                                                onChange={handleChangeCours}
                                            >
                                                {
                                                    filterCourse && filterCourse.map((data, index) => {
                                                        if (data?.active === true) {
                                                            return (
                                                                <MenuItem key={index} value={data}>{data?.title}</MenuItem>
                                                            )
                                                        }

                                                    })
                                                }
                                            </Select>
                                        </FormControl>
                                        {
                                        plansList?.length > 0 && isMobileDevice && (
                                            <Box className="mobile-view-schedule">
                                                <Typography variant='p' onClick={handleViewPlan} sx={{ fontWeight: "bold", width: "fit-content", padding: "14px 2px !important", fontSize: "12px", color: "#DD2A3D", fontWeight: "bold", cursor: "pointer" }} >View Schedules</Typography>
                                            </Box>
                                        )
                                    } 
                                    </>)}
                                {
                                    activeStep === 1 && (
                                        <>
                                            {
                                                selectCourse?.id && (
                                                    <FormControl className='mobile-select-button'>
                                                        <InputLabel id="demo-simple-select-label" sx={{ fontSize: "13px" }}>Schedule</InputLabel>
                                                        <Select
                                                            className='select-option'
                                                            sx={{ mb: 2, minWidth: "100px", maxWidth: "300px", fontSize: "12px", mr: 2, width: "200px", fontSize: "12px" }}
                                                            labelId="demo-simple-select-label"
                                                            id="demo-simple-select"
                                                            label="Schedule"
                                                            value={selectShedule}
                                                            onChange={handleChange}
                                                        >
                                                            {
                                                                courseContentList && courseContentList.map((data, index) => {
                                                                    return (
                                                                        <MenuItem key={index} value={data}>{data?.title}</MenuItem>
                                                                    )
                                                                })
                                                            }
                                                        </Select>
                                                    </FormControl>
                                                )
                                            }
                                            
                                        </>
                                    )
                                }

                            </Stack>
                            {
                                !isMobileDevice && activeStep === 0 && (
                                    <Grid container>
                                        <Grid item xs={12} sm={12} md={12} lg={12}>
                                            {
                                                plansList?.length > 0 && (
                                                    <Box>
                                                        <Typography variant='p' onClick={handleViewPlan} sx={{ fontWeight: "bold", width: "fit-content", padding: "14px 2px !important", fontSize: "12px", color: "#DD2A3D", fontWeight: "bold", cursor: "pointer" }} >View Schedules</Typography>
                                                    </Box>
                                                )
                                            }
                                        </Grid>
                                    </Grid>
                                )
                            }

                        </Grid>
                    </Grid> */}

                    <Grid container className='mobile-container'>
                        <Grid item xs={12} sm={9} md={9} lg={9}>
                            <Typography variant='h6' sx={{ color: "black", fontWeight: 'bold', mb: 4, mt: 2 }}>{plansList[0]?.title}</Typography>
                            <Typography variant='p' sx={{}}>Customize your Test Series Bucket, you can choose either group vise or Individual subject vise</Typography>
                            <Box sx={{ mt: 2, ml: 1 }} className="filter-btn">
                                <Button onClick={() => handleFilter('group')} sx={{ background: filterGroupSubject === "group" ? "#DD2A3D" : "", color: filterGroupSubject === "group" ? "#fff" : "#DD2A3D", fontWeight: "bold", marginRight: '16px !important', border: "1px solid #c1c1c196", fontSize: "12px", padding: "14px 11px!important" }} className='mobile-group-btn button-hover'>Groups Wise</Button>
                                <Button onClick={() => handleFilter('subject')} sx={{ background: filterGroupSubject === "subject" ? "#DD2A3D" : "", color: filterGroupSubject === "subject" ? "#fff" : "#DD2A3D", fontWeight: "bold", marginRight: '16px', border: "1px solid #c1c1c196", fontSize: "12px", padding: "14px 11px!important" }} className='mobile-group-btn button-hover'>Subjects</Button>

                            </Box>
                            <Box sx={{ mt: 1, ml: 1 }} className="filter-btn">

                                {
                                    filterGroupSubject === "group" && (
                                        <Box className="mobile-filter-btn" sx={{ display: 'inline-grid' }}>
                                            <Button onClick={() => handleButtonClick('both')} sx={{ mb: 1, background: activeBtn === "both" ? "#DD2A3D" : "", color: activeBtn === "both" ? "#fff" : "#DD2A3D", fontWeight: "bold", width: "fit-content", padding: "14px 11px!important", border: "1px solid #c1c1c196", fontSize: "12px", width: "110px" }} className='mobile-group-btn button-hover'>Both Group</Button>
                                            <Button onClick={() => handleButtonClick('group1')} sx={{ mb: 1, background: activeBtn === "group1" ? "#DD2A3D" : "", color: activeBtn === "group1" ? "#fff" : "#DD2A3D", fontWeight: "bold", width: "fit-content", padding: "14px 11px!important", border: "1px solid #c1c1c196", fontSize: "12px", width: "110px" }} className='mobile-group-btn button-hover'>Group 1</Button>
                                            <Button onClick={() => handleButtonClick('group2')} sx={{ mb: 1, background: activeBtn === "group2" ? "#DD2A3D" : "", color: activeBtn === "group2" ? "#fff" : "#DD2A3D", fontWeight: "bold", width: "fit-content", padding: "14px 11px!important", border: "1px solid #c1c1c196", fontSize: "12px", width: "110px" }} className='mobile-group-btn button-hover'>Group 2</Button>
                                        </Box>
                                    )
                                }
                                {
                                    filterGroupSubject === "subject" && (
                                        <FormControl className='mobile-select-button' sx={{ marginTop: !isMobileDevice ? "20px" : "8px" }} >
                                            <InputLabel id="demo-simple-select-label" sx={{ fontSize: "13px" }}>Subject Wise</InputLabel>
                                            <Select
                                                defaultOpen={true}
                                                onOpen={handleSelectSub}
                                                sx={{ minWidth: "100px", maxWidth: "300px", width: "200px", fontSize: "12px" }}
                                                labelId='channel-lable'
                                                className='select-option'
                                                multiple
                                                value={selectSubjectWise}
                                                onChange={handleSubjectWise}
                                                renderValue={(selected) => selected?.map((x) => x?.title).join(', ')}
                                                // renderValue={(selected) => (selected.title).join(', ')}
                                                // MenuProps={MenuProps}
                                                label="Subject Wise"
                                            >
                                                {
                                                    subjectWiseListRender && subjectWiseListRender
                                                        .filter(item => item.title === item.title)
                                                        .map((item, index) => {
                                                            return (
                                                                <MenuItem key={index} value={item} className='mobile-container'>
                                                                    <Checkbox checked={selectSubjectWise.indexOf(item) > -1} />
                                                                    <ListItemText primary={item?.title} />
                                                                </MenuItem>
                                                            );
                                                        })
                                                }
                                            </Select>
                                        </FormControl>
                                    )
                                }
                            </Box>

                        </Grid>
                        <Grid item xs={12} sm={3} md={3} lg={3}>
                            {
                                schedule?.id && (
                                    <Typography sx={{ mb: 1, py: 1 }}>
                                        {/* {cartArray?.length > 0 && (<Box sx={{ textAlign: "right" }}><Button disabled={cartArray?.length > 0 ? false : true} onClick={handleShowCart} sx={{ fontWeight: "bold", color: "#000", fontSize: "14px", border: "1px solid #80808038", textTransform: "initial", background: '#DD2A3D', color: '#fff', padding: "14px 11px" }} className='button-hover mobile-view-checkout'><ArrowForwardIcon />&nbsp; Go to Cart Details</Button></Box>)} */}
                                        {
                                            selectCourse?.id && (
                                                <>
                                                    <div className='react-multi-carousel-list'>
                                                        <Grid container>
                                                            {
                                                                plansList && plansList.map((item, i) => {
                                                                    let object = getPlanPrice(item, activeBtn, selectSubjectWise);
                                                                    let logo = object?.thumbLogo;
                                                                    let price = object?.price;
                                                                    let finalPrices = object?.finalPrice === 0 ? Number(price) - (Number(price / 100) * Number(item?.discount)) : object?.finalPrice;
                                                                    let discount = 100 - ((finalPrices / price) * 100)
                                                                    const fullDescription = item?.description?.description || "";
                                                                    return <Grid item xs={12} sm={12} md={12} lg={12} sx={{ padding: "5px", textAlign: "center", }}>
                                                                        <Box sx={{ borderRadius: "10px", position: "relative", boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px" }}>
                                                                            <img
                                                                                // src={"img/p1 surbhi test series (2).jpg"}
                                                                                src={filterGroupSubject === "subject" ? Endpoints + subjectWiseListRender[0]?.description?.thumb : object?.thumbLogo ? Endpoints + logo : "img/p1 surbhi test series (2).jpg"}
                                                                                style={{ width: "100%", borderRadius: "10px", height: "100%", minHeight: "150px", borderBottom: "1px solid #8080804a" }} />
                                                                            {/* <img src={"img/folder-2.png"} style={{ width: "100%", borderRadius: "10px", height: "max-content", maxHeight: "180px" }} /> */}
                                                                            <Box sx={{ pb: 4 }}>
                                                                                <Typography variant='h6' fontWeight={"bold"} sx={{ mt: 2, mb: 1, color: "black" }}>
                                                                                    {item?.title}
                                                                                </Typography>
                                                                                {/* <Typography variant='p' className='mobile-view-discrip' sx={{ fontSize: "12px", margin: "0px 10px" }}>
                                                                                    {setCourseExpandedDescriptions === false ? truncateDescription(fullDescription) : truncateDescription(fullDescription)}
                                                                                    {fullDescription.length > 100 && (
                                                                                        <span style={{ color: 'blue', cursor: 'pointer', marginLeft: '5px', textDecoration: 'underline' }} onClick={() => toggleExpandDescription(fullDescription)}>
                                                                                            {setCourseExpandedDescriptions ? 'more' : 'more'}
                                                                                        </span>
                                                                                    )}
                                                                                </Typography> */}
                                                                                <Box sx={{ textAlign: "left", padding: selectSubjectWise?.length > 0 ? "5px 10px" : "0px" }}>
                                                                                    {
                                                                                        selectSubjectWise?.length > 0 && selectSubjectWise?.map((chipLebel, i) => {
                                                                                            return <Chip size="small" label={chipTitle(chipLebel?.title)} variant="outlined" key={i} sx={{ margin: "5px", backgroundColor: "#dd2a3d3b", color: "#DD2A3D", fontWeight: "bold", border: "1px" }} />
                                                                                        })
                                                                                    }

                                                                                </Box>
                                                                                {
                                                                                    item.paid ?
                                                                                        <p style={{ marginLeft: "2px", marginRight: "2px" }}>
                                                                                            {
                                                                                                object.percent > 0 ? <p style={{ fontWeight: "bold", color: "#00BC78", display: "flex", textAlign: 'center', alignItems: "center", justifyContent: 'center', marginTop: "10px" }}>
                                                                                                    <p style={{ fontSize: "20px" }}>
                                                                                                        Fee:  ₹ {object?.finalPrice.toFixed(2)}
                                                                                                    </p>
                                                                                                    <p style={{ color: "black", fontSize: "20px" }}> &nbsp; <s>{price}</s> &nbsp;{object.percent}% off</p>
                                                                                                </p>
                                                                                                    : <p style={{ fontWeight: "bold", color: "#00BC78", display: "flex", textAlign: 'center', alignItems: "center", justifyContent: 'center', marginTop: "10px" }}><p style={{ fontSize: "20px" }}>Fee: ₹ {price}</p></p>
                                                                                            }
                                                                                        </p>
                                                                                        :
                                                                                        <p>
                                                                                            Free
                                                                                            {/* {getPlanPrice(item)} */}
                                                                                        </p>
                                                                                }
                                                                            </Box>
                                                                            <Box sx={{ position: "absolute", bottom: "0", left: 0, right: 0, padding: "0px 10px 0 10px" }}>
                                                                                <Button
                                                                                    sx={{ background: "red", color: "#fff", margin: "10px 0px 10px 0px", width: "100%", fontWeight: "bold" }}
                                                                                    onClick={() => handleEnrollNow(item)}
                                                                                    className='button-hover'
                                                                                >
                                                                                    Enroll Now
                                                                                    {/* {cartArray.some(cartItem => cartItem.plan.id === item.id) ? "Added" : "Add to cart"} */}
                                                                                </Button>
                                                                            </Box>
                                                                        </Box>
                                                                    </Grid>
                                                                })
                                                            }

                                                            <Typography variant='p' sx={{ fontSize: "12px", margin: "0px 10px" }}>
                                                                {plansList[0]?.description?.description ? parse(plansList[0]?.description?.description) : ""}
                                                            </Typography>
                                                        </Grid>
                                                    </div>

                                                </>
                                            )
                                        }
                                        <Typography variant='p' className='desktop-view-discrip' sx={{ fontSize: "12px", margin: "0px 10px" }}>
                                            {plansList[0]?.description?.description ? parse(plansList[0]?.description?.description) : ""}
                                        </Typography>
                                    </Typography>
                                )
                            }

                        </Grid>

                    </Grid>

                    <Grid container className='desktop-container'>
                        <Grid item xs={12} sm={4} md={4} lg={4}>
                            {
                                schedule?.id && (
                                    <Typography sx={{ mb: 1, py: 1 }}>
                                        {/* {cartArray?.length > 0 && (<Box sx={{ textAlign: "right" }}><Button disabled={cartArray?.length > 0 ? false : true} onClick={handleShowCart} sx={{ fontWeight: "bold", color: "#000", fontSize: "14px", border: "1px solid #80808038", textTransform: "initial", background: '#DD2A3D', color: '#fff', padding: "14px 11px" }} className='button-hover mobile-view-checkout'><ArrowForwardIcon />&nbsp; Go to Cart Details</Button></Box>)} */}
                                        {
                                            selectCourse?.id && (
                                                <>
                                                    <div className='desktop-plan-box'>
                                                        <Grid container sx={{ padding: 1 }}>
                                                            {
                                                                plansList && plansList.map((item, i) => {

                                                                    let object = getPlanPrice(item, activeBtn, selectSubjectWise);

                                                                    let logo = object?.thumbLogo;
                                                                    let price = object?.price;
                                                                    let finalPrices = object?.finalPrice === 0 ? Number(price) - (Number(price / 100) * Number(item?.discount)) : object?.finalPrice;
                                                                    let discount = 100 - ((finalPrices / price) * 100)
                                                                    const fullDescription = item?.description?.description || "";

                                                                    return <Grid item xs={11} sm={11} md={11} lg={11} sx={{ padding: "10px", textAlign: "center", }}>
                                                                        <Box sx={{ borderRadius: "10px", position: "relative", boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px" }}>
                                                                            <img
                                                                                // src={"img/p1 surbhi test series (2).jpg"}
                                                                                src={filterGroupSubject === "subject" ? Endpoints + subjectWiseListRender[0]?.description?.thumb : object?.thumbLogo ? Endpoints + logo : "img/p1 surbhi test series (2).jpg"}
                                                                                style={{ width: "100%", borderRadius: "10px", height: "100%", minHeight: "150px", borderBottom: "1px solid #8080804a" }} />
                                                                            {/* <img src={"img/folder-2.png"} style={{ width: "100%", borderRadius: "10px", height: "max-content", maxHeight: "180px" }} /> */}
                                                                            <Box sx={{ pb: 4 }}>
                                                                                <Typography variant='h6' fontWeight={"bold"} sx={{ mt: 2, mb: 2, color: "black" }}>
                                                                                    {item?.title}

                                                                                </Typography>

                                                                                <Box sx={{ textAlign: "left", padding: selectSubjectWise?.length > 0 ? "5px 10px" : "0px" }}>
                                                                                    {
                                                                                        selectSubjectWise?.length > 0 && selectSubjectWise?.map((chipLebel, i) => {
                                                                                            return <Chip size="small" label={chipTitle(chipLebel?.title)} variant="outlined" key={i} sx={{ margin: "5px", backgroundColor: "#dd2a3d3b", color: "#DD2A3D", fontWeight: "bold", border: "1px", fontSize: "12px" }} />
                                                                                        })
                                                                                    }

                                                                                </Box>
                                                                                {
                                                                                    item.paid ?
                                                                                        <p>
                                                                                            {
                                                                                                object.percent > 0 ? <p style={{ fontWeight: "bold", color: "#00BC78", display: "flex", textAlign: 'center', alignItems: "center", justifyContent: 'center', marginTop: "10px" }}>
                                                                                                    <p style={{ fontSize: "16px" }}>
                                                                                                        Fee: ₹ {object?.finalPrice.toFixed(2)}
                                                                                                    </p>
                                                                                                    <p style={{ color: "black", fontSize: "16px" }}> &nbsp; <s>{(price).toFixed(2)}</s> &nbsp;{(object.percent)}% off</p>
                                                                                                </p>
                                                                                                    : <p style={{ fontWeight: "bold", color: "#00BC78", display: "flex", textAlign: 'center', alignItems: "center", justifyContent: 'center', marginTop: "10px" }}><p style={{ fontSize: "16px" }}>Fee: ₹ {(object?.finalPrice).toFixed(2)}</p></p>
                                                                                            }
                                                                                        </p>
                                                                                        :
                                                                                        <p>
                                                                                            Free
                                                                                            {/* {getPlanPrice(item)} */}
                                                                                        </p>
                                                                                }
                                                                            </Box>
                                                                            <Box sx={{ position: "absolute", bottom: "0", left: 0, right: 0, padding: "0px 10px 0 10px" }}>
                                                                                <Button
                                                                                    sx={{ background: "red", color: "#fff", margin: "10px 0px 10px 0px", width: "100%", fontWeight: "bold" }}
                                                                                    onClick={() => handleEnrollNow(item)}
                                                                                    className='button-hover'
                                                                                >
                                                                                    Enroll Now
                                                                                    {/* {cartArray.some(cartItem => cartItem.plan.id === item.id) ? "Added" : "Add to cart"} */}
                                                                                </Button>
                                                                            </Box>
                                                                        </Box>
                                                                    </Grid>
                                                                })
                                                            }

                                                        </Grid>
                                                    </div>
                                                </>
                                            )
                                        }
                                        <Typography variant='p' className='desktop-view-discrip' sx={{ fontSize: "12px", margin: "0px 10px" }}>
                                            {plansList[0]?.description?.description ? parse(plansList[0]?.description?.description) : ""}
                                        </Typography>
                                    </Typography>
                                )
                            }

                        </Grid>
                        <Grid item xs={12} sm={8} md={8} lg={8}>
                            <Typography variant='h6' sx={{ color: "black", fontWeight: 'bold', mb: 4, mt: 2 }}>{plansList[0]?.title}</Typography>
                            <Typography variant='p' sx={{}}>Customize your Test Series Bucket, you can choose either group vise or Individual subject vise</Typography>
                            <Box sx={{ mt: 2, ml: 1 }} className="filter-btn">
                                <Button onClick={() => handleFilter('group')} sx={{ background: filterGroupSubject === "group" ? "#DD2A3D" : "", color: filterGroupSubject === "group" ? "#fff" : "#DD2A3D", fontWeight: "bold", marginRight: '16px !important', border: "1px solid #c1c1c196", fontSize: "12px", padding: "14px 11px!important" }} className='mobile-group-btn button-hover'>Groups Wise</Button>
                                <Button onClick={() => handleFilter('subject')} sx={{ background: filterGroupSubject === "subject" ? "#DD2A3D" : "", color: filterGroupSubject === "subject" ? "#fff" : "#DD2A3D", fontWeight: "bold", marginRight: '16px', border: "1px solid #c1c1c196", fontSize: "12px", padding: "14px 11px!important" }} className='mobile-group-btn button-hover'>Subjects</Button>

                            </Box>
                            <Box sx={{ mt: 1, ml: 1 }} className="filter-btn">

                                {
                                    filterGroupSubject === "group" && (
                                        <Box className="mobile-filter-btn" sx={{ display: 'inline-grid' }}>
                                            <Button onClick={() => handleButtonClick('both')} sx={{ mb: 1, background: activeBtn === "both" ? "#DD2A3D" : "", color: activeBtn === "both" ? "#fff" : "#DD2A3D", fontWeight: "bold", width: "fit-content", padding: "14px 11px!important", border: "1px solid #c1c1c196", fontSize: "12px", width: "110px" }} className='mobile-group-btn button-hover'>Both Group</Button>
                                            <Button onClick={() => handleButtonClick('group1')} sx={{ mb: 1, background: activeBtn === "group1" ? "#DD2A3D" : "", color: activeBtn === "group1" ? "#fff" : "#DD2A3D", fontWeight: "bold", width: "fit-content", padding: "14px 11px!important", border: "1px solid #c1c1c196", fontSize: "12px", width: "110px" }} className='mobile-group-btn button-hover'>Group 1</Button>
                                            <Button onClick={() => handleButtonClick('group2')} sx={{ mb: 1, background: activeBtn === "group2" ? "#DD2A3D" : "", color: activeBtn === "group2" ? "#fff" : "#DD2A3D", fontWeight: "bold", width: "fit-content", padding: "14px 11px!important", border: "1px solid #c1c1c196", fontSize: "12px", width: "110px" }} className='mobile-group-btn button-hover'>Group 2</Button>
                                        </Box>
                                    )
                                }
                                {
                                    filterGroupSubject === "subject" && (
                                        <FormControl className='mobile-select-button' sx={{ marginTop: !isMobileDevice ? "20px" : "8px" }} >
                                            <InputLabel id="demo-simple-select-label" sx={{ fontSize: "13px" }}>Subject Wise</InputLabel>
                                            <Select
                                                defaultOpen={true}
                                                onOpen={handleSelectSub}
                                                sx={{ minWidth: "100px", maxWidth: "300px", width: "200px", fontSize: "12px" }}
                                                labelId='channel-lable'
                                                className='select-option'
                                                multiple
                                                value={selectSubjectWise}
                                                onChange={handleSubjectWise}
                                                renderValue={(selected) => selected?.map((x) => x?.title).join(', ')}
                                                // renderValue={(selected) => (selected.title).join(', ')}
                                                // MenuProps={MenuProps}
                                                label="Subject Wise"
                                            >
                                                {
                                                    subjectWiseListRender && subjectWiseListRender
                                                        .filter(item => item.title === item.title)
                                                        .map((item, index) => {
                                                            return (
                                                                <MenuItem key={index} value={item} className='desktop-container'>
                                                                    <Checkbox checked={selectSubjectWise.indexOf(item) > -1} />
                                                                    <ListItemText primary={item?.title} />
                                                                </MenuItem>
                                                            );
                                                        })
                                                }
                                            </Select>
                                        </FormControl>
                                    )
                                }
                            </Box>

                        </Grid>
                    </Grid>
                    <div>
                        {
                            activeStep === 1 && (
                                <Typography sx={{ mt: 3, mb: 3, py: 1 }}>
                                    <Box
                                        sx={{
                                            padding: !isMobileDevice ? "" : "0 2rem",
                                            margin: isMobileDevice ? "" : "0 2rem",
                                            display: "flex",
                                            justifyContent: "end",
                                            mb: 1
                                            // borderBottom: "1px solid #80808038"
                                        }}
                                    >

                                        <FormControl className='mobile-select-button'>
                                            <InputLabel id="demo-simple-select-label" sx={{ fontSize: "13px" }}>Schedule</InputLabel>
                                            <Select
                                                className='select-option'
                                                sx={{ mb: 2, minWidth: "100px", maxWidth: "300px", fontSize: "12px", width: "230px", fontSize: "12px" }}
                                                labelId="demo-simple-select-label"
                                                id="demo-simple-select"
                                                label="Schedule"
                                                value={selectShedule}
                                                onChange={handleChange}
                                            >
                                                {
                                                    courseContentList && courseContentList.map((data, index) => {
                                                        return (
                                                            <MenuItem key={index} value={data}>{data?.title}</MenuItem>
                                                        )
                                                    })
                                                }
                                            </Select>
                                        </FormControl>

                                    </Box>
                                    {
                                        plansList?.length > 0 && selectShedule?.title !== "UnScheduled" && (
                                            <Box className="mobile-plan-box">
                                                <Typography variant='p' onClick={handleViewPlan} sx={{ fontWeight: "bold", width: "fit-content", padding: "14px 10px !important", fontSize: "12px", color: "#DD2A3D", fontWeight: "bold", cursor: "pointer", border: "1px solid #8080804d", borderRadius: "8px", marginLeft: "20px", width: '70%' }} >View Schedules</Typography>
                                            </Box>
                                        )
                                    }
                                    <Grid container sx={{ borderBottom: "1px solid #80808038", }}>
                                        <Grid item xs={12} sm={9.5} md={9.5} lg={9.5}>
                                            <Grid container>
                                                {
                                                    cartArray?.length > 0 && cartArray?.map((item, i) => {

                                                        let object = getPlanPrice(item.plan, item.group, item.subject);
                                                        let subjects = item.subject;
                                                        // getEntityIdPurchase(object)
                                                        // console.log('objectobjectobjectobject', object);
                                                        let logo = object?.thumbLogo
                                                        let price = object?.price;
                                                        let finalPrices = object?.finalPrice === 0 ? Number(price) - (Number(price / 100) * Number(item?.plan?.discount)) : object?.finalPrice;
                                                        let discount = 100 - ((finalPrices / price) * 100)

                                                        let details = item.plan;
                                                        const preview = peviewImgVideo[details.id];
                                                        const newDiscount = details.discount || 0;
                                                        const newPrice = details.price || 0;
                                                        const totalPrice = 0;
                                                        const fullDescription = details?.description?.description || "";

                                                        return <Grid item xs={12} sm={12} md={12} lg={12} key={i} sx={{ position: "relative" }}>
                                                            <Grid container sx={{ marginTop: "10px" }}>
                                                                <Grid item xs={6} sm={4} md={4} lg={4}>
                                                                    <Box sx={{
                                                                        background: "rgb(123 127 129 / 7%)",
                                                                        margin: "15px", borderRadius: "8px", display: "flex", justifyContent: "center"
                                                                    }}>
                                                                        <img src={subjects?.length > 0 ? Endpoints + subjects[0]?.description?.thumb : logo ? Endpoints + logo : 'img/folder-2.png'} style={{ width: '70%', padding: '5px', maxHeight: '280px' }} alt="Preview" className='mobile-view-image' />

                                                                    </Box>
                                                                    <Box sx={{
                                                                        background: "rgb(123 127 129 / 7%)",
                                                                        margin: "15px", borderRadius: "8px", display: "flex", justifyContent: "center"
                                                                    }}>
                                                                        {
                                                                            details?.description?.video && (

                                                                                <video controls src={details?.description?.video ? Endpoints + details?.description?.video : ''} style={{ width: "70%", height: "200px", padding: '5px' }} onClick={() => handlePreview(details?.description?.video, 'video', details.id)} />

                                                                            )
                                                                        }
                                                                    </Box>
                                                                </Grid>
                                                                <Grid item xs={6} sm={8} md={8} lg={8} sx={{ padding: "10px" }}>
                                                                    <Typography variant='h5' fontWeight={"bold"} sx={{ color: "#000" }}>
                                                                        {details?.title}
                                                                    </Typography>

                                                                    <Box sx={{ textAlign: "left", padding: item.subject?.length > 0 ? "5px 0px" : "0px", mt: 1, mb: 1 }}>
                                                                        {
                                                                            item.subject?.length > 0 && item.subject?.map((chipLebel, i) => {
                                                                                return <Chip size="small" label={chipTitle(chipLebel?.title)} variant="outlined" key={i} sx={{ marginRight: "5px", backgroundColor: "#dd2a3d3b", color: "#DD2A3D", fontWeight: "bold", border: "1px", fontSize: "12px" }} />
                                                                            })
                                                                        }

                                                                    </Box>

                                                                    {details?.paid ? (
                                                                        <p>
                                                                            {discount > 0 ? (
                                                                                <p style={{ fontWeight: 'bold' }}>
                                                                                    <p style={{ marginBottom: 0 }}>
                                                                                        Price Rs. {object?.finalPrice.toFixed(2)}
                                                                                    </p>
                                                                                </p>
                                                                            ) : (
                                                                                <p style={{ fontWeight: 'bold' }}>Price Rs. {(price).toFixed(2)}</p>
                                                                            )}
                                                                        </p>
                                                                    ) : (
                                                                        <p>Free</p>
                                                                    )}
                                                                    <Typography variant='p' sx={{}} className='mobile-view-discrip'>
                                                                        {setCourseExpandedDescriptions === false ? truncateDescription(fullDescription) : truncateDescription(fullDescription)}
                                                                        {fullDescription.length > 100 && (
                                                                            <span style={{ color: 'blue', cursor: 'pointer', marginLeft: '5px', textDecoration: 'underline' }} onClick={() => toggleExpandDescription(fullDescription)}>
                                                                                {setCourseExpandedDescriptions ? 'more' : 'more'}
                                                                            </span>
                                                                        )}
                                                                    </Typography>
                                                                    <Typography variant='p' sx={{}} className='desktop-view-discrip'>
                                                                        {details?.description?.description ? parse(details?.description?.description) : ""}
                                                                    </Typography>
                                                                    <Box>
                                                                        <Button onClick={() => handleRemoveItem(item, i)} sx={{ textTransform: "initial", fontSize: 'small', padding: '10px 0' }}>Remove from Cart</Button>
                                                                    </Box>
                                                                </Grid>
                                                            </Grid>
                                                        </Grid>
                                                    })
                                                }
                                            </Grid>
                                        </Grid>
                                        <Grid item xs={12} sm={2.5} md={2.5} lg={2.5}>
                                            {
                                                suggestedCourse?.length > 0 && (
                                                    <>

                                                        <Typography variant='h6' fontWeight={'bold'} ml={3} mb={1} mt={3} className='mobile-suggested mobile-plan-box'>Suggested Course</Typography>
                                                        <Carousel
                                                            className=''
                                                            swipeable={true}
                                                            draggable={true}
                                                            showDots={true}
                                                            responsive={responsive}
                                                            ssr={true} // means to render carousel on server-side.
                                                            infinite={true}
                                                            //   autoPlay={this.props.deviceType !== "mobile" ? true : false}
                                                            autoPlaySpeed={1000}
                                                            keyBoardControl={true}
                                                            customTransition="all .5"
                                                            transitionDuration={500}
                                                            containerClass="carousel-container"
                                                            removeArrowOnDeviceType={["tablet", "mobile"]}
                                                            //   deviceType={this.props.deviceType}
                                                            dotListClass="custom-dot-list-style"
                                                            itemClass="carousel-item-padding-40-px"
                                                        >
                                                            {
                                                                suggestedCourse && suggestedCourse.map((course, id) => {
                                                                    return <Grid container sx={{ justifyContent: "center", alignItems: "center", marginBottom: 2 }}>
                                                                        <Grid item xs={12} sm={2.4} md={2.4} lg={2.4} sx={{ padding: "5px", textAlign: "left", }}>
                                                                            <Box sx={{ boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px" }}>
                                                                                <img src={Endpoints + course.logo} alt="cardthumbimage" style={{ width: "100%", height: "125px" }} />
                                                                                <Stack gap={'0.5rem'} pl={'1rem'} pr={'1rem'}>
                                                                                    <Stack direction={'row'} justifyContent={'space-between'} alignItems={'center'} textAlign={"left"}>
                                                                                        <p style={{ width: "100%", fontWeight: "bold", margin: 0 }}>
                                                                                            {course.title}
                                                                                        </p>
                                                                                    </Stack>
                                                                                    {
                                                                                        course.paid ?
                                                                                            <>
                                                                                                {
                                                                                                    course.discount > 0 ? <p style={{ fontWeight: "bold", color: "#f59f00", display: "flex", fontSize: "11px", margin: 0 }}>
                                                                                                        <p>
                                                                                                            {Number(course.price) - (Number(course.price) * (Number(course.discount) / 100))}/-
                                                                                                        </p>

                                                                                                        <p style={{ color: "#e5dfdf" }}> &nbsp; <s>{course.price}/-</s> &nbsp;{course.discount}%</p>
                                                                                                    </p>
                                                                                                        : <p style={{ fontWeight: "bold", color: "#f59f00" }}>{course.price}/-</p>
                                                                                                }
                                                                                            </>
                                                                                            :
                                                                                            <p style={{ fontWeight: "bold", fontSize: "11px" }}>
                                                                                                Free
                                                                                            </p>
                                                                                    }
                                                                                    {/* <div>
                                                                                            <div className={course.active ? " bg-green-500 h-3 w-3 rounded-full" : " bg-red-500 w-3 h-3 rounded-full"}></div>
                                                                                        </div> */}
                                                                                </Stack>
                                                                                <Box sx={{ textAlign: 'right' }}>
                                                                                    <Button startIcon={selectedIds.includes(course?.id) ?
                                                                                        <CheckCircleRoundedIcon /> :
                                                                                        <AddCircleIcon fontSize="40px" />
                                                                                    } onClick={() => handleAddCourse(course)}>{selectedIds.includes(course?.id) ? "Added" : "Add to cart"}</Button>
                                                                                </Box>
                                                                            </Box>
                                                                        </Grid>
                                                                    </Grid>
                                                                })
                                                            }
                                                        </Carousel>
                                                    </>
                                                )
                                            }
                                            <div className='desktop-plan-box'>
                                                {
                                                    plansList?.length > 0 && selectShedule?.title !== "UnScheduled" && (
                                                        <Box className="mobile-view-schedule" sx={{ display: "flex", justifyContent: "end" }}>
                                                            <Typography variant='p' onClick={handleViewPlan} sx={{ fontWeight: "bold", width: "fit-content", padding: "14px 10px!important", fontSize: "12px", color: "#DD2A3D", fontWeight: "bold", cursor: "pointer", border: "1px solid #8080804d", borderRadius: "8px", marginRight: "20px" }} >View Schedules</Typography>
                                                        </Box>
                                                    )
                                                }
                                                {
                                                    suggestedCourse?.length > 0 && (
                                                        <Grid container sx={{ padding: 1, height: suggestedCourse?.length > 2 ? "530px" : "", overflowY: suggestedCourse?.length > 2 ? "scroll" : "none" }}>
                                                            <Grid item xs={12} sm={12} md={12} lg={12} sx={{ padding: "10px" }}>
                                                                <Typography variant='h6' fontWeight={'bold'} ml={3} mb={1} sx={{ color: "black" }} className='mobile-suggested'>Suggested Course</Typography>
                                                                <Box sx={{ ml: 3 }} className='mobile-suggested'>
                                                                    <Grid container>
                                                                        {
                                                                            suggestedCourse?.length > 0 && suggestedCourse.map((course, i) => {
                                                                                return <Grid item xs={12} sm={12} md={12} lg={12}>
                                                                                    <Box sx={{
                                                                                        boxShadow: "rgba(0, 0, 0, 0.11) 0px 5px 15px", margin: "10px"
                                                                                    }} >
                                                                                        <img src={Endpoints + course.logo} alt="cardthumbimage" style={{ width: "100%", height: "125px" }} />
                                                                                        <Stack gap={'0.5rem'} pl={'1rem'} pr={'1rem'}>
                                                                                            <Stack direction={'row'} justifyContent={'space-between'} alignItems={'center'} textAlign={"left"}>
                                                                                                <p style={{ width: "100%", fontWeight: "bold", margin: 0 }}>
                                                                                                    {course.title}
                                                                                                </p>
                                                                                            </Stack>
                                                                                            {
                                                                                                course.paid ?
                                                                                                    <>
                                                                                                        {
                                                                                                            course.discount > 0 ? <p style={{ fontWeight: "bold", color: "#f59f00", display: "flex", fontSize: "11px", margin: 0 }}>
                                                                                                                <p>
                                                                                                                    {Number(course.price) - (Number(course.price) * (Number(course.discount) / 100))}/-
                                                                                                                </p>

                                                                                                                <p style={{ color: "#e5dfdf" }}> &nbsp; <s>{course.price}/-</s> &nbsp;{course.discount}%</p>
                                                                                                            </p>
                                                                                                                : <p style={{ fontWeight: "bold", color: "#f59f00" }}>{course.price}/-</p>
                                                                                                        }
                                                                                                    </>
                                                                                                    :
                                                                                                    <p style={{ fontWeight: "bold", fontSize: "11px" }}>
                                                                                                        Free
                                                                                                    </p>
                                                                                            }
                                                                                            {/* <div>
                                                                                            <div className={course.active ? " bg-green-500 h-3 w-3 rounded-full" : " bg-red-500 w-3 h-3 rounded-full"}></div>
                                                                                        </div> */}
                                                                                        </Stack>
                                                                                        <Box sx={{ textAlign: 'right' }}>
                                                                                            <Button startIcon={selectedIds.includes(course?.id) ?
                                                                                                <CheckCircleRoundedIcon /> :
                                                                                                <AddCircleIcon fontSize="40px" />
                                                                                            } onClick={() => handleAddCourse(course)}>{selectedIds.includes(course?.id) ? "Added" : "Add to cart"}</Button>
                                                                                        </Box>
                                                                                    </Box>
                                                                                </Grid>
                                                                            })
                                                                        }
                                                                    </Grid>
                                                                </Box>

                                                            </Grid>
                                                        </Grid>
                                                    )
                                                }
                                                {/* <Box sx={{ textAlign: 'right', mb: 3 }} className="desktop-plan-box desktop-view-checkout">
                                                                <Button sx={{ fontWeight: "bold", background: "#DD2A3D", color: "#fff", boxShadow: "4px 3px 14px 0px rgba(0,0,0,0.5)", display: "inline", padding: "14px 11px", fontSize: "12px" }} onClick={handleAddToCard} className='button-hover mobile-buy-now'>Proceed to Checkout  <span style={{ fontSize: "12px", textTransform: "initial", color: "#fbff00", padding: 0, margin: 0 }}>
                                                                    &nbsp;&nbsp;Total Price: {(totalPrice).toFixed(2)}
                                                                </span>
                                                                </Button>
                                                            </Box> */}
                                            </div>
                                        </Grid>
                                    </Grid>
                                    <Grid container>
                                        <Grid item xs={12} sm={12} md={12} lg={12}>
                                            <Box sx={{ textAlign: 'right', mb: 3 }} className="desktop-plan-box desktop-view-checkout">
                                                {/* <Button sx={{
                                                    fontWeight: "bold", background: "#DD2A3D", color: "#fff", boxShadow: "4px 3px 14px 0px rgba(0,0,0,0.5)", display: "inline", padding: "14px 11px", fontSize: "12px",
                                                    animation: "pulse 2s infinite",
                                                    '@keyframes pulse': {
                                                        '0%': {
                                                            transform: 'scale(1)',
                                                        },
                                                        '50%': {
                                                            transform: 'scale(1.05)',
                                                        },
                                                        '100%': {
                                                            transform: 'scale(1)',
                                                        },
                                                    },
                                                    transition: "transform 0.3s ease, box-shadow 0.3s ease",
                                                    '&:hover': {
                                                        backgroundColor: "#C22530",
                                                        boxShadow: "6px 5px 20px 0px rgba(0,0,0,0.7)",
                                                    },
                                                    '&:active': {
                                                        transform: "scale(0.98)",
                                                    },
                                                }} onClick={handleCheckoutSubmit} className='button-hover mobile-buy-now'>Proceed to Checkout  <span style={{ fontSize: "12px", textTransform: "initial", color: "#fbff00", padding: 0, margin: 0 }}>
                                                        &nbsp;&nbsp;Total Price: {(totalPrice).toFixed(2)}
                                                    </span>
                                                </Button> */}
                                            </Box>
                                        </Grid>

                                    </Grid>
                                    <Box sx={{ textAlign: 'right', ml: 2, mb: 3 }} className="mobile-view-checkout mobile-plan-box">
                                        {/* <Button sx={{
                                            fontWeight: "bold", background: "#DD2A3D", color: "#fff", mt: 3, boxShadow: "4px 3px 14px 0px rgba(0,0,0,0.5)", display: "inline", padding: "14px 11px", fontSize: "12px",
                                            animation: "pulse 2s infinite",
                                            '@keyframes pulse': {
                                                '0%': {
                                                    transform: 'scale(1)',
                                                },
                                                '50%': {
                                                    transform: 'scale(1.05)',
                                                },
                                                '100%': {
                                                    transform: 'scale(1)',
                                                },
                                            },
                                            transition: "transform 0.3s ease, box-shadow 0.3s ease",
                                            '&:hover': {
                                                backgroundColor: "#C22530",
                                                boxShadow: "6px 5px 20px 0px rgba(0,0,0,0.7)",
                                            },
                                            '&:active': {
                                                transform: "scale(0.98)",
                                            },
                                        }} onClick={handleCheckoutSubmit} className='button-hover mobile-buy-now'>Proceed to Checkout  <span style={{ fontSize: "12px", textTransform: "initial", color: "#fbff00", padding: 0, margin: 0 }}>
                                                &nbsp;&nbsp;Total Price: {(totalPrice).toFixed(2)}
                                            </span>
                                        </Button> */}
                                    </Box>
                                </Typography>
                            )
                        }
                        {
                            activeStep === 2 && (
                                <Typography sx={{ mt: 3, mb: 1, py: 1 }}>
                                    <Card sx={{ width: "100%", boxShadow: "rgba(0, 0, 0, 0.11) 0px 3px 8px", textAlign: "center", mb: 3 }}>
                                        <Typography padding={1} mt={3} fontWeight={'bold'} variant='h5'>
                                            Please fill this details
                                        </Typography>
                                        <Grid container sx={{ margin: "20px 0", justifyContent: "center" }}>
                                            <Grid item xs={12} sm={6} md={6} lg={6}>
                                                <TextField
                                                    className='mobile-fill-textfield'
                                                    fullWidth
                                                    variant="outlined"
                                                    type="text"
                                                    label="Name"
                                                    name="name"
                                                    value={title}
                                                    onChange={(e) => setTitle(e.target.value)}
                                                    InputProps={{
                                                        style: {
                                                            borderRadius: "10px", fontSize: '14px'
                                                        }
                                                    }}
                                                    InputLabelProps={{
                                                        sx: {
                                                            fontSize: '14px',
                                                            fontWeight: 'bold',
                                                        }
                                                    }}
                                                    sx={{ gridColumn: "span 12", m: 2 }}
                                                />
                                                <TextField
                                                    inputProps={{
                                                        maxLength: 10
                                                    }}
                                                    className='mobile-fill-textfield'
                                                    fullWidth
                                                    variant="outlined"
                                                    type="number"
                                                    label="Number"
                                                    name="number"
                                                    value={number}
                                                    onChange={handleNumberChange}
                                                    error={!!error}
                                                    helperText={error}
                                                    InputProps={{
                                                        style: {
                                                            borderRadius: "10px", fontSize: '14px'
                                                        }
                                                    }}
                                                    InputLabelProps={{
                                                        sx: {
                                                            fontSize: '14px',
                                                            fontWeight: 'bold',
                                                        }
                                                    }}
                                                    sx={{ gridColumn: "span 12", m: 2 }}
                                                />
                                                <TextField
                                                    className='mobile-fill-textfield'
                                                    fullWidth
                                                    variant="outlined"
                                                    type="email"
                                                    label="Email"
                                                    name="email"
                                                    value={email}
                                                    onChange={(e) => setEmail(e.target.value)}
                                                    InputProps={{
                                                        style: {
                                                            borderRadius: "10px", fontSize: '14px'
                                                        }
                                                    }}
                                                    InputLabelProps={{
                                                        sx: {
                                                            fontSize: '14px',
                                                            fontWeight: 'bold',
                                                        }
                                                    }}
                                                    sx={{ gridColumn: "span 12", m: 2 }}
                                                />
                                                {
                                                    orderBumpCourse?.price ?
                                                        <>
                                                            <InputLabel sx={{
                                                                width: '100%',
                                                                textAlign: "left",
                                                                fontWeight: 'bold',
                                                                fontSize: '12px',
                                                                color: 'black',
                                                                ml: 2
                                                            }}>{orderBumpCourse?.title}</InputLabel>
                                                            <div className='mobile-headint-margin'>
                                                                <Box sx={{ background: "rgb(0 0 0 / 8%)", m: 2, width: "100%" }} display={'flex'} alignItems={'center'}
                                                                    justifyContent={"space-between"} padding={"5px"} border={'1px solid #02020247'}
                                                                    borderRadius={'10px'} className='mobile-fill-textfield'>
                                                                    <Typography
                                                                        sx={{ fontWeight: '700', ml: 1 }}
                                                                    >
                                                                        &#8377; &nbsp; {(orderBumpCourse.price - ((orderBumpCourse.price / 100) * orderBumpCourse.discount)).toFixed(2)}
                                                                    </Typography>
                                                                    <Checkbox
                                                                        checked={checked}
                                                                        onChange={handleCheckboxChange}
                                                                        color="primary"
                                                                    />
                                                                </Box>
                                                            </div>
                                                            <p style={{ fontSize: '14px', color: '#00000075', margin: '5px 0px 0px 5px' }}>
                                                                {orderBumpCourse?.setting?.orderBumpDescription}
                                                            </p>
                                                        </> : ""
                                                }

                                                <Box sx={{ textAlign: "end" }}>    <Typography component="div" fontWeight={'bold'} onClick={handleReedemCode} sx={{ cursor: 'pointer', color: "#3f8abf", margin: "5px 0px 0px 5px", fontSize: "10px", marginRight: isMobileDevice ? "0px" : "10px" }}>Reedem Code</Typography></Box>

                                                {
                                                    reedemCode === true && (
                                                        <div className='mobile-fill-textfield'>
                                                            <InputLabel sx={{
                                                                width: '100%',
                                                                textAlign: "left",
                                                                fontWeight: 'bold',
                                                                fontSize: '12px',
                                                                color: 'black',
                                                                ml: !isMobileDevice ? 1 : 2
                                                            }}>Enter Coupon</InputLabel>

                                                            <OutlinedInput
                                                                className='mobile-coupon-field'
                                                                fullWidth
                                                                type="text"
                                                                // label="Enter Coupon"
                                                                name="number"
                                                                value={couponNumber}
                                                                onChange={handleCoupon}
                                                                id="outlined-adornment-weight"
                                                                endAdornment={
                                                                    <InputAdornment position="end">
                                                                        <IconButton
                                                                            disabled={couponNumber && number ? false : true}
                                                                            aria-label="toggle password visibility"
                                                                            onClick={handleCheckCoupon}
                                                                            edge="end"
                                                                            sx={{ fontSize: "12px", color: getColor() }}
                                                                        >
                                                                            {isCouponValid === true ? <><CheckIcon color="success" />Applied</> : "Apply"}
                                                                        </IconButton>
                                                                    </InputAdornment>
                                                                }
                                                                //   endAdornment={<InputAdornment position="end" onClick={handleSendOtp}>Resend Otp</InputAdornment>}
                                                                aria-describedby="outlined-weight-helper-text"
                                                                InputProps={{
                                                                    style: {
                                                                        borderRadius: "10px", fontSize: '14px'
                                                                    }
                                                                }}
                                                                sx={{ gridColumn: "span 12", m: "0px 16px 16px 16px", borderRadius: "10px" }}
                                                            />
                                                            {errorMessage && <FormHelperText error sx={{ marginLeft: "12px" }}>{errorMessage}</FormHelperText>}
                                                        </div>
                                                    )
                                                }
                                                <Box sx={{
                                                    display: "flex",
                                                    justifyContent: "space-between",
                                                    alignItems: "center",
                                                    margin: "16px",
                                                    width: "100%"
                                                }}>
                                                    <Typography variant="h6" color={'darkblue'}><b>Total price :</b> </Typography>
                                                    <Typography variant="h6" fontWeight={'bold'}>
                                                        &#8377; {checked ? (orderBumpCourse.price - ((orderBumpCourse.price / 100) * orderBumpCourse.discount)) + totalPrice : totalPrice}
                                                    </Typography>
                                                </Box>
                                                {
                                                    isCouponValid === true && (
                                                        <>
                                                            <Box sx={{
                                                                display: "flex",
                                                                justifyContent: "space-between",
                                                                alignItems: "center",
                                                                margin: "10px"
                                                            }}>
                                                                <Typography variant="h6" color={'red'}><b>Discount price :</b> </Typography>
                                                                <Typography variant="h6" fontWeight={'bold'}>
                                                                    &#8377; {couponDiscount}
                                                                </Typography>
                                                            </Box>
                                                            <Box sx={{
                                                                display: "flex",
                                                                justifyContent: "space-between",
                                                                alignItems: "center",
                                                                margin: "10px"
                                                            }}>
                                                                <Typography variant="h6" color={'#329908'}><b>Final price :</b> </Typography>
                                                                <Typography variant="h6" fontWeight={'bold'}>
                                                                    &#8377; {checked ? ((orderBumpCourse.price - ((orderBumpCourse.price / 100) * orderBumpCourse.discount)) + totalPrice) - couponDiscount : totalPrice - couponDiscount}
                                                                </Typography>
                                                            </Box>
                                                        </>
                                                    )
                                                }

                                            </Grid>
                                        </Grid>
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            sx={{ width: "200px", padding: "10px", margin: "15px", fontSize: '13px' }}
                                            onClick={handleSubmit}
                                            disabled={title === '' || number === '' || email === ''}
                                        >
                                            Pay
                                        </Button>
                                    </Card>
                                </Typography>
                            )
                        }
                        {
                            activeStep === 3 && (
                                <Typography sx={{ mt: 3, mb: 1, py: 1 }}>
                                    <Card sx={{ width: "100%", boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px", textAlign: "center" }}>
                                        <Grid container sx={{ margin: "20px 0", justifyContent: "center" }}>
                                            <Grid item xs={12} sm={4} md={4} lg={4}>
                                                <Typography variant='h3'>
                                                    <img src="img/Thank you image size 4ratio3.jpg" alt="" style={{ margin: "5px", height: "250px" }} />

                                                </Typography>
                                                <Typography sx={{ fontWeight: "bold", fontSize: "12px" }}>
                                                    For access to Test papers and to upload Answer Sheet, you need to download our Application. Currently the student dashboard is not available on the web.
                                                    <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", mt: 2 }}>
                                                        <img src="img/playstore.svg" alt="" style={{ margin: "5px" }} />
                                                        <img src="img/applestore.svg" alt="" style={{ margin: "5px" }} />
                                                        <img src="img/windowstore.svg" alt="" style={{ margin: "5px" }} />
                                                    </Box>

                                                </Typography>
                                                <Button
                                                    variant="contained"
                                                    color="primary"
                                                    sx={{ width: "250px", padding: "10px", margin: "15px", fontSize: "12px" }}
                                                    onClick={() => {
                                                        setActiveStep(0);
                                                        setAddedCartPlans([]);
                                                        setAddtoCartIds([]);
                                                        setPurchaseArray([]);
                                                        setSelectedIds([]);
                                                        setSelectSubjectWise([]);
                                                        setChecked(false);
                                                    }}
                                                >
                                                    ENROL FOR ANOTHER TEST SERIES
                                                </Button>
                                            </Grid>
                                        </Grid>
                                    </Card>
                                </Typography>
                            )
                        }
                    </div>


                </div>
            </div>
            <Dialog open={enrolledNowModal} onClose={() => setEnrolledNowModal(false)}>
                <EnrolledNowForm setTitle={setTitle} title={title} handleNumberChange={handleNumberChange} number={number} error={error} setEmail={setEmail} email={email} orderBumpCourse={orderBumpCourse} checked={checked} handleCheckboxChange={handleCheckboxChange} isCouponValid={isCouponValid} errorMessage={errorMessage} totalPrice={totalPrice} couponDiscount={couponDiscount} handleSubmit={handleSubmit} handleReedemCode={handleReedemCode} isMobileDevice={isMobileDevice} reedemCode={reedemCode} couponNumber={couponNumber} handleCoupon={handleCoupon} handleCheckCoupon={handleCheckCoupon} getColor={getColor} />
                {/* <DialogActions>
                    <Button onClick={() => setEnrolledNowModal(false)}>Close</Button>
                </DialogActions> */}
            </Dialog>

            <Dialog open={thankyouModal} onClose={() => setThankyouModal(false)}>
                <Typography sx={{ mt: 3, mb: 1, py: 1 }}>
                    <Card sx={{ width: "100%", boxShadow: "none", textAlign: "center" }}>
                        <Grid container sx={{ margin: "20px 0", justifyContent: "center" }}>
                            <Grid item xs={12} sm={12} md={12} lg={12}>
                                <Typography variant='h6' sx={{ mb: 2 }}>
                                    {/* <img src="img/Thank you image size 4ratio3.jpg" alt="" style={{ margin: "5px", height: "250px" }} /> */}
                                    Thank you for your purchase!
                                    <Typography variant='h5' sx={{ mb: 2, mt: 1 }}>
                                        {filterCourse[0]?.title} Test Series
                                    </Typography>
                                </Typography>
                                <Typography sx={{ fontWeight: "bold", fontSize: "14px", mb: 1 }}>
                                    To access test papers and upload answer sheets, please share your payment slip on WhatsApp and download our app. 📲
                                    {/* <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", mt: 2 }}>
                                                        <img src="img/playstore.svg" alt="" style={{ margin: "5px" }} />
                                                        <img src="img/applestore.svg" alt="" style={{ margin: "5px" }} />
                                                        <img src="img/windowstore.svg" alt="" style={{ margin: "5px" }} />
                                                    </Box> */}

                                </Typography>
                                <Typography sx={{ fontWeight: "bold", fontSize: "14px" }}>
                                    <WhatsAppIcon color='success' sx={{ fontSize: "55px", cursor: "pointer" }} onClick={handleWhatsappClick} />
                                </Typography>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    sx={{ width: "250px", padding: "10px", margin: "15px", fontSize: "12px" }}
                                    onClick={() => {
                                        setActiveStep(0);
                                        setAddedCartPlans([]);
                                        setAddtoCartIds([]);
                                        setPurchaseArray([]);
                                        setSelectedIds([]);
                                        setSelectSubjectWise([]);
                                        setChecked(false);
                                        setThankyouModal(false)
                                    }}
                                >
                                    ENROL FOR ANOTHER TEST SERIES
                                </Button>
                            </Grid>
                        </Grid>
                    </Card>
                </Typography>
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
