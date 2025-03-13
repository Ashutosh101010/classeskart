import { Box, Button, Card, Checkbox, Chip, Dialog, DialogActions, DialogContent, Divider, FormControl, FormHelperText, Grid2, IconButton, InputAdornment, InputLabel, ListItemText, MenuItem, OutlinedInput, Select, Stack, Step, StepLabel, Stepper, styled, TextField, Typography, useMediaQuery } from '@mui/material';
import React, { useEffect, useRef, useState } from 'react'
import axios from 'axios';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import parse from "html-react-parser";
import 'react-multi-carousel/lib/styles.css';
// import ViewPlanModal from './AllPlans';
// import { useNavigate, UNSAFE_NavigationContext } from "react-router-dom";
import { Base64 } from 'js-base64';
import PropTypes from 'prop-types';
// import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import EnrolledNowForm from './EnrollNow';


const steps = ['Plans', 'Details', 'Checkout', 'Done'];

export const TestSeries = () => {

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
    const [cartArraySubjects, setCartArraySubjects] = useState([]);
    const [enrolledNowModal, setEnrolledNowModal] = useState(false);
    const [thankyouModal, setThankyouModal] = useState(false);

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
        if (cartArray?.length > 0) {
            const allEntityIds = [];
            let totalPrice = 0;
            cartArray?.forEach((item) => {
                const object = getPlanPrice(item.plan, item.group, item.subject);
                let price = object?.price;
                totalPrice += object?.finalPrice === 0 ? Number(price) - (Number(price / 100) * Number(item?.plan?.discount)) : object?.finalPrice;
                object.entityId?.forEach((entity) => {
                    allEntityIds.push(entity);
                });
            });
            setTotalPrice(totalPrice)
            setPurchaseArray(allEntityIds);
            localStorage.setItem("purchaseArray", JSON.stringify(allEntityIds));
        }
        if (cartArraySubjects?.length > 0) {
            const allEntityIds = [];
            let totalPrice = 0;
            cartArraySubjects?.forEach((item) => {
                const object = getPlanPrice(item.plan, item.group, item.subject);

                let price = object?.price;
                totalPrice += object?.finalPrice === 0 ? Number(price) - (Number(price / 100) * Number(item?.plan?.discount)) : object?.finalPrice;
                object.entityId?.forEach((entity) => {
                    allEntityIds.push(entity);
                });
            });
            setTotalPrice(totalPrice)
            setPurchaseArray(allEntityIds);
            localStorage.setItem("purchaseArray", JSON.stringify(allEntityIds));
        }
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

        addedCartPlans?.forEach(cartItem => {
            plansList?.forEach(plan => {
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
        alltreeList?.forEach((plan) => {
            if (selectBtnType === 'group1') {
                if (plan.children?.length > 0) {
                    plan.children?.forEach((group) => {
                        if (group.title === 'Group 1') {
                            if (!checkPlansExists(plans, plan.title)) {
                                plans.push(plan);
                            }
                            if (group?.children?.length > 0) {
                                group.children?.forEach((subject) => {
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
                    plan.children?.forEach((group) => {
                        if (group.title === 'Group 2') {
                            if (!checkPlansExists(plans, plan.title)) {
                                plans.push(plan);
                            }
                            if (group?.children?.length > 0) {
                                group.children?.forEach((subject) => {
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
                    plan.children?.forEach((group) => {
                        if (group.title === 'Group 2' || group.title === 'Group 1') {
                            if (!checkPlansExists(plans, plan.title)) {
                                plans.push(plan);
                            }
                            if (group?.children?.length > 0) {
                                group.children?.forEach((subject) => {
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
        subjectList?.forEach((subject) => {
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
                plan.children?.forEach((group) => {
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
            plan?.children?.forEach((group) => {
                if (group?.children?.length > 0) {
                    group?.children?.forEach((subject) => {
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
                plan?.children?.forEach((group) => {
                    let allSubjectSelectOfGroup = false;
                    let groupSelectedSubject = 0;
                    let selectedOfGroup = [];
                    group?.children?.forEach((subject) => {
                        if (selectedSubject?.length > 0) {
                            selectedSubject?.forEach((selectedSubject) => {
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
                        selectedOfGroup?.forEach((selectedSubject) => {
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
            plan?.children?.forEach((group) => {
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
                        selectedSubject?.forEach((selectedSubject) => {


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
            plan?.children?.forEach((group) => {
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
                        selectedSubject?.forEach((selectedSubject) => {
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

    const handleEnrollNow = (item) => {
        setCartArraySubjects([])
        const id = item.id;
        const isSelected = cartArray.some(cartItem => cartItem.plan.id === id); // Check if the item is already in the cart

        if (isSelected) {
            const updatedCartArray = cartArray.filter(cartItem => cartItem.plan.id !== id);
            setCartArray(updatedCartArray);
            localStorage.setItem("cartArray", JSON.stringify(updatedCartArray));
        } else {
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
    }

    const handleEnrollNowSubject = (item) => {
        setActiveBtn('both')
        if (activeBtn === "both") {
            handleSelectSubjects(item)
        }
    };

    const handleSelectSubjects = (item) => {
        setCartArray([])
        const id = item.id;
        const isSelected = cartArraySubjects.some(cartItem => cartItem.plan.id === id);

        if (isSelected) {
            const updatedCartArray = cartArraySubjects.filter(cartItem => cartItem.plan.id !== id);
            const updateSub = selectSubjectWise.filter(cartItem => cartItem.id !== id);
            // getPlanPrice(item, 'both', updateSub)
            setSelectSubjectWise(updateSub)
            setCartArraySubjects(updatedCartArray);
            localStorage.setItem("cartArraySubjects", JSON.stringify(updatedCartArray));
        } else {
            // getPlanPrice(item, 'both', [...selectSubjectWise, item])
            const obj = {
                group: activeBtn,
                subject: selectSubjectWise,
                plan: item
            };
            const updatedCartArray = [...cartArraySubjects, obj];
            setSelectSubjectWise([...selectSubjectWise, item])
            setCartArraySubjects(updatedCartArray);
            localStorage.setItem("cartArraySubjects", JSON.stringify(updatedCartArray));
            // cartNumberUpdate()
        }
        // setEnrolledNowModal(true)
    }
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
        cartArray?.forEach((item, x) => {
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

    const handleProceddToCheckout = () => {
        setEnrolledNowModal(true)
    }

    return (
        <div className="test-series" style={{ textAlign: 'left' }}>
            <div>
                <h2 className='mobile-text-high' style={{
                    textTransform: "initial",
                    display: "flex", alignItems: "center", textAlign: "left", fontWeight: "bold", marginBottom: "15px", justifyContent: "left",
                }}>Highly Rated Test Series Programs</h2>
            </div>

            <Grid2 container>
                <Grid2 item size={{ xs: 12, sm: 12, md: 12, lg: 12 }} sx={{ mb: 4 }}>
                    <Typography variant='h6' sx={{ color: "black", fontWeight: 'bold', mb: 1 }}>{selectCourse?.title}</Typography>
                    <Typography variant='p' sx={{}}>{selectCourse?.shortDescription}</Typography>
                </Grid2>
                <Grid2 item size={{ xs: 12, sm: 12, md: 12, lg: 12 }}>
                    <Box>
                        <img className='course-img-video' src={selectCourse?.logo ? Endpoints + selectCourse?.logo : ""} style={{ height: "100%", padding: '5px', borderRadius: "10px" }} />
                    </Box>
                </Grid2>
                <Grid2 item size={{ xs: 12, sm: 12, md: 12, lg: 12 }} sx={{ mb: 4, mt: 4 }}>
                    <Typography variant='p' sx={{}}>{selectCourse?.description ? parse(selectCourse?.description) : ""}</Typography>
                </Grid2>
            </Grid2>
            <Divider sx={{ background: "#80808000", width: "100%" }} />
            <Grid2 container className='mobile-container'>
                <Grid2 item size={{ xs: 12, sm: 9, md: 9, lg: 9 }}>
                    <Typography variant='h6' sx={{ color: "black", fontWeight: 'bold', mb: 4, mt: 2 }}>{plansList[0]?.title}</Typography>
                    <Typography variant='p' sx={{}}>Customize your Test Series Bucket, you can choose either group vise or Individual subject vise</Typography>

                    <Grid2 container>
                        <Grid2 size={{ xs: 12, sm: 4, md: 4, lg: 4 }}>
                            <Button onClick={() => handleButtonClick('both')} sx={{ mb: 1, background: activeBtn === "both" ? "#DD2A3D" : "", color: activeBtn === "both" ? "#fff" : "#DD2A3D", fontWeight: "bold", width: "fit-content", padding: "14px 11px!important", border: "1px solid #c1c1c196", fontSize: "12px", width: "100%" }} className='mobile-group-btn button-hover'>Both Group</Button>
                        </Grid2>
                        <Grid2 size={{ xs: 12, sm: 4, md: 4, lg: 4 }}>
                            <Button onClick={() => handleButtonClick('group1')} sx={{ mb: 1, background: activeBtn === "group1" ? "#DD2A3D" : "", color: activeBtn === "group1" ? "#fff" : "#DD2A3D", fontWeight: "bold", width: "fit-content", padding: "14px 11px!important", border: "1px solid #c1c1c196", fontSize: "12px", width: "100%" }} className='mobile-group-btn button-hover'>Group 1</Button>
                        </Grid2>
                        <Grid2 size={{ xs: 12, sm: 4, md: 4, lg: 4 }}>
                            <Button onClick={() => handleButtonClick('group2')} sx={{ mb: 1, background: activeBtn === "group2" ? "#DD2A3D" : "", color: activeBtn === "group2" ? "#fff" : "#DD2A3D", fontWeight: "bold", width: "fit-content", padding: "14px 11px!important", border: "1px solid #c1c1c196", fontSize: "12px", width: "100%" }} className='mobile-group-btn button-hover'>Group 2</Button>
                        </Grid2>
                    </Grid2>

                </Grid2>
                <Grid2 item size={{ xs: 12, sm: 3, md: 3, lg: 3 }}>
                    {
                        schedule?.id && (
                            <Typography sx={{ mb: 1, py: 1 }}>
                                {
                                    selectCourse?.id && (
                                        <>
                                            <div className='react-multi-carousel-list'>
                                                <Grid2 container>
                                                    {
                                                        plansList && plansList.map((item, i) => {
                                                            let object = getPlanPrice(item, activeBtn, selectSubjectWise);
                                                            let logo = object?.thumbLogo;
                                                            let price = object?.price;
                                                            let finalPrices = object?.finalPrice === 0 ? Number(price) - (Number(price / 100) * Number(item?.discount)) : object?.finalPrice;
                                                            let discount = 100 - ((finalPrices / price) * 100)
                                                            const fullDescription = item?.description?.description || "";
                                                            return <Grid2 item xs={12} sm={12} md={12} lg={12} sx={{ padding: "5px", textAlign: "center", }} key={i}>
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
                                                                                            <p style={{ fontSize: "20px", marginTop: "0px" }}>
                                                                                                Fee:  ₹ {object?.finalPrice.toFixed(2)}
                                                                                            </p>
                                                                                            <p style={{ color: "black", fontSize: "20px" }}> &nbsp; <s>{price}</s> &nbsp;{object.percent}% off</p>
                                                                                        </p>
                                                                                            : <p style={{ fontWeight: "bold", color: "#00BC78", display: "flex", textAlign: 'center', alignItems: "center", justifyContent: 'center', marginTop: "10px" }}><p style={{ fontSize: "20px", marginTop: "0px" }}>Fee: ₹ {price}</p></p>
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
                                                            </Grid2>
                                                        })
                                                    }

                                                    <Typography variant='p' sx={{ fontSize: "12px", margin: "0px 10px" }}>
                                                        {plansList[0]?.description?.description ? parse(plansList[0]?.description?.description) : ""}
                                                    </Typography>
                                                </Grid2>
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

                </Grid2>

            </Grid2>

            <Grid2 container className='desktop-container'>
                <Grid2 item size={{ xs: 12, sm: 4, md: 4, lg: 4 }}>
                    {
                        schedule?.id && (
                            <Typography sx={{ mb: 1, py: 1 }}>
                                {
                                    selectCourse?.id && (
                                        <>
                                            <div className='desktop-plan-box'>
                                                <Grid2 container sx={{ padding: 1 }}>
                                                    {
                                                        plansList && plansList.map((item, i) => {

                                                            let object = getPlanPrice(item, activeBtn, selectSubjectWise);

                                                            let logo = object?.thumbLogo;
                                                            let price = object?.price;
                                                            let finalPrices = object?.finalPrice === 0 ? Number(price) - (Number(price / 100) * Number(item?.discount)) : object?.finalPrice;
                                                            let discount = 100 - ((finalPrices / price) * 100)
                                                            const fullDescription = item?.description?.description || "";

                                                            return <Grid2 item xs={11} sm={11} md={11} lg={11} sx={{ padding: "10px", textAlign: "center", }} key={i}>
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
                                                                                            <p style={{ fontSize: "16px", marginTop: "0px" }}>
                                                                                                Fee: ₹ {object?.finalPrice.toFixed(2)}
                                                                                            </p>
                                                                                            <p style={{ color: "black", fontSize: "16px" }}> &nbsp; <s>{(price).toFixed(2)}</s> &nbsp;{(object.percent)}% off</p>
                                                                                        </p>
                                                                                            : <p style={{ fontWeight: "bold", color: "#00BC78", display: "flex", textAlign: 'center', alignItems: "center", justifyContent: 'center', marginTop: "10px" }}><p style={{ fontSize: "16px", marginTop: "0px" }}>Fee: ₹ {(object?.finalPrice).toFixed(2)}</p></p>
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
                                                            </Grid2>
                                                        })
                                                    }

                                                </Grid2>
                                            </div>
                                        </>
                                    )
                                }
                            </Typography>
                        )
                    }

                </Grid2>
                <Grid2 item size={{ xs: 12, sm: 8, md: 8, lg: 8 }}>
                    <Typography variant='h6' sx={{ color: "black", fontWeight: 'bold', mb: 4, mt: 2 }}>{plansList[0]?.title}</Typography>
                    <Typography variant='p' sx={{}}>Customize your Test Series Bucket, you can choose either group vise or Individual subject vise</Typography>
                    {/* <Box sx={{ mt: 2, ml: 1 }} className="filter-btn">
                                <Button onClick={() => handleFilter('group')} sx={{ background: filterGroupSubject === "group" ? "#DD2A3D" : "", color: filterGroupSubject === "group" ? "#fff" : "#DD2A3D", fontWeight: "bold", marginRight: '16px !important', border: "1px solid #c1c1c196", fontSize: "12px", padding: "14px 11px!important" }} className='mobile-group-btn button-hover'>Groups Wise</Button>
                                <Button onClick={() => handleFilter('subject')} sx={{ background: filterGroupSubject === "subject" ? "#DD2A3D" : "", color: filterGroupSubject === "subject" ? "#fff" : "#DD2A3D", fontWeight: "bold", marginRight: '16px', border: "1px solid #c1c1c196", fontSize: "12px", padding: "14px 11px!important" }} className='mobile-group-btn button-hover'>Subjects</Button>

                            </Box> */}
                    <Box sx={{ mt: 1, ml: 1 }} className="filter-btn">

                        {/* {
                                    filterGroupSubject === "group" && ( */}
                        <Box className="mobile-filter-btn" sx={{}}>
                            <Button onClick={() => handleButtonClick('both')} sx={{ mb: 1, mr: 1, background: activeBtn === "both" ? "#DD2A3D" : "", color: activeBtn === "both" ? "#fff" : "#DD2A3D", fontWeight: "bold", width: "fit-content", padding: "14px 11px!important", border: "1px solid #c1c1c196", fontSize: "12px", width: "110px" }} className='mobile-group-btn button-hover'>Both Group</Button>
                            <Button onClick={() => handleButtonClick('group1')} sx={{ mb: 1, mr: 1, background: activeBtn === "group1" ? "#DD2A3D" : "", color: activeBtn === "group1" ? "#fff" : "#DD2A3D", fontWeight: "bold", width: "fit-content", padding: "14px 11px!important", border: "1px solid #c1c1c196", fontSize: "12px", width: "110px" }} className='mobile-group-btn button-hover'>Group 1</Button>
                            <Button onClick={() => handleButtonClick('group2')} sx={{ mb: 1, mr: 1, background: activeBtn === "group2" ? "#DD2A3D" : "", color: activeBtn === "group2" ? "#fff" : "#DD2A3D", fontWeight: "bold", width: "fit-content", padding: "14px 11px!important", border: "1px solid #c1c1c196", fontSize: "12px", width: "110px" }} className='mobile-group-btn button-hover'>Group 2</Button>
                        </Box>
                        {/* //     )
                                // } */}

                    </Box>
                    <Typography variant='p' className='desktop-view-discrip' sx={{ fontSize: "12px", margin: "0px 10px" }}>
                        {plansList[0]?.description?.description ? parse(plansList[0]?.description?.description) : ""}
                    </Typography>
                </Grid2>
            </Grid2>
            <Grid2 container spacing={2}>
                <Grid2 item size={{ xs: 12, sm: 12, md: 12, lg: 12 }}>
                    <Typography fontWeight={'bold'} sx={{ color: '#000', ml: 2 }}>Subjects</Typography>
                    {/* <FormControl className='mobile-select-button' sx={{ marginTop: !isMobileDevice ? "20px" : "8px" }} >
                                            <InputLabel id="demo-simple-select-label" sx={{ fontSize: "13px" }}>Subject Wise</InputLabel>
                                            <Select
                                                // defaultOpen={true}
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
                                        </FormControl> */}
                    <Grid2 container sx={{ padding: 1 }}>
                        {
                            subjectWiseListRender && subjectWiseListRender.map((item, i) => {
                                let object = getPlanPrice(item, activeBtn, selectSubjectWise);
                                let logo = object?.thumbLogo;
                                let price = object?.price;
                                let finalPrices = object?.finalPrice === 0 ? Number(item?.price) - (Number(item?.price / 100) * Number(item?.discount)) : object?.finalPrice;
                                let discount = 100 - ((finalPrices / price) * 100)
                                const fullDescription = item?.description?.description || "";

                                return <Grid2 item size={{ xs: 12, sm: 2, md: 2, lg: 2 }} sx={{ padding: "10px", textAlign: "center", }} key={i}>
                                    <Box sx={{ borderRadius: "10px", position: "relative", boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px" }}>
                                        <img
                                            // src={"img/p1 surbhi test series (2).jpg"}
                                            src={item?.thumb ? Endpoints + item?.thumb : "img/p1 surbhi test series (2).jpg"}
                                            style={{ width: "100%", borderRadius: "10px", height: "100%", minHeight: "150px", borderBottom: "1px solid #8080804a" }} />
                                        {/* <img src={"img/folder-2.png"} style={{ width: "100%", borderRadius: "10px", height: "max-content", maxHeight: "180px" }} /> */}
                                        <Box sx={{}}>
                                            <Typography variant='h6' fontWeight={"bold"} sx={{ mt: 1, color: "black", fontSize: "12px" }}>
                                                {item?.title}

                                            </Typography>

                                            {/* <Box sx={{ textAlign: "left", padding: selectSubjectWise?.length > 0 ? "5px 10px" : "0px" }}>
                                                                                    {
                                                                                        selectSubjectWise?.length > 0 && selectSubjectWise?.map((chipLebel, i) => {
                                                                                            return <Chip size="small" label={chipTitle(chipLebel?.title)} variant="outlined" key={i} sx={{ margin: "5px", backgroundColor: "#dd2a3d3b", color: "#DD2A3D", fontWeight: "bold", border: "1px", fontSize: "12px" }} />
                                                                                        })
                                                                                    }

                                                                                </Box> */}
                                            {
                                                item.paid ?
                                                    <p style={{ paddingBottom: "20px", marginTop: "0px" }}>
                                                        {
                                                            object.percent > 0 ? <p style={{ fontWeight: "bold", color: "#00BC78", display: "flex", textAlign: 'center', alignItems: "center", justifyContent: 'center', marginTop: "10px" }}>
                                                                <p style={{ fontSize: "12pz", marginTop: "0px" }}>
                                                                    Fee: ₹ {object?.finalPrice !== 0 ? object?.finalPrice.toFixed(2) : finalPrices}
                                                                </p>
                                                                <p style={{ color: "black", fontSize: "16px" }}> &nbsp; <s>{(price).toFixed(2)}</s> &nbsp;{(object.percent)}% off</p>
                                                            </p>
                                                                : <p style={{ fontWeight: "bold", color: "#00BC78", display: "flex", textAlign: 'center', alignItems: "center", justifyContent: 'center', marginTop: "10px" }}><p style={{ fontSize: "12pz", marginTop: "0px" }}>Fee: ₹ {object?.finalPrice !== 0 ? (object?.finalPrice).toFixed(2) : finalPrices}</p></p>
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
                                                sx={{ background: "red", color: "#fff", margin: "10px 0px 10px 0px", width: "100%", fontWeight: "bold", fontSize: "12px" }}
                                                onClick={() => handleEnrollNowSubject(item)}
                                                className='button-hover'
                                            >

                                                {cartArraySubjects.some(cartItem => cartItem.plan.id === item.id) ? "Added" : "Add to cart"}
                                            </Button>
                                        </Box>
                                    </Box>
                                </Grid2>
                            })
                        }

                    </Grid2>
                </Grid2>
            </Grid2>
            <Dialog open={enrolledNowModal} onClose={() => setEnrolledNowModal(false)}>
                <EnrolledNowForm setTitle={setTitle} title={title} handleNumberChange={handleNumberChange} number={number} error={error} setEmail={setEmail} email={email} orderBumpCourse={orderBumpCourse} checked={checked} handleCheckboxChange={handleCheckboxChange} isCouponValid={isCouponValid} errorMessage={errorMessage} totalPrice={totalPrice} couponDiscount={couponDiscount} handleSubmit={handleSubmit} handleReedemCode={handleReedemCode} isMobileDevice={isMobileDevice} reedemCode={reedemCode} couponNumber={couponNumber} handleCoupon={handleCoupon} handleCheckCoupon={handleCheckCoupon} getColor={getColor} />
                {/* <DialogActions>
                    <Button onClick={() => setEnrolledNowModal(false)}>Close</Button>
                </DialogActions> */}
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
