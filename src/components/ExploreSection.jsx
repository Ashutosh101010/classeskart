
import { Box, Button, FormControl, FormControlLabel, FormLabel, Grid2, InputLabel, MenuItem, Radio, RadioGroup, Select, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import Network from "./Network";
import { useLocation, useNavigate } from "react-router-dom";
import { Banners } from "./BannesSection";
import { BASE_URL } from "./Endpoints";
import instId from "./InstituteId";
import axios from "axios";
import { ExploreCourseSection } from "./ExploreCourseSection";

export default function ExploreSection({setCourses}) {

    const location = useLocation();
    const firstFilter = location?.state?.selectedLevelOne;
    const secondFilter = location?.state?.selectedLevelTwo;
    const thirdFilter = location?.state?.selectedLevelThree;
    const [endpoints, setEndpoints] = useState('');

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

    return (
        <div className="domain-fliter" style={{ padding: "20px" }}>
            <Banners endpointsUrl={endpoints} thirdFilter={thirdFilter} />
            <ExploreCourseSection endpointsUrl={endpoints} firstFilter={firstFilter} secondFilter={secondFilter} thirdFilter={thirdFilter} setCourses={setCourses} />
        </div>
    )
}