
import { Box, Button, FormControl, FormControlLabel, FormLabel, Grid2, InputLabel, MenuItem, Radio, RadioGroup, Select, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import Network from "./Network";
import { useNavigate } from "react-router-dom";
import instId from "./InstituteId";

export default function DomainFilter({setCourses}) {

    const navigate = useNavigate();
    const [levelOne, setLevelOne] = useState([]);
    const [levelTwo, setLevelTwo] = useState([]);
    const [levelThree, setLevelThree] = useState([]);
    const [selectedLevelOne, setSelectedLevelOne] = useState(null);
    const [selectedLevelTwo, setSelectedLevelTwo] = useState(null);
    const [selectedLevelThree, setSelectedLevelThree] = useState("");
    const [course, setCourse] = useState([]);

    useEffect(() => {
        getDomainList();
    }, [])

      useEffect(() => {
            if (levelOne?.length > 0) {
                getCourseList();
            }
    
        }, [levelOne])

          useEffect(() => {
                if (!course || course.length === 0) return;
        
                let filtered = [...course];

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
            }, [course, selectedLevelThree]);

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
                    const filteredByThird = filterCoursesByThirdFilter(caCourses, levelOne, selectedLevelThree);
                    setCourse(selectedLevelThree ? filteredByThird : caCourses);
                };
            } catch (error) {
                console.log(error);
            }
        };


    const getDomainList = async () => {
        try {

            const domainResponse = await Network.fetchDomain();
            if (domainResponse?.errorCode === 0) {
                const data = domainResponse?.domains;
                setLevelOne(data);
                if (data.length > 0) {
                    const firstLevelOne = data[0];
                    setSelectedLevelOne(firstLevelOne.id);

                    const levelTwoData = firstLevelOne.child || [];
                    setLevelTwo(levelTwoData);

                    if (levelTwoData.length > 0) {
                        const firstLevelTwo = levelTwoData[0];
                        setSelectedLevelTwo(firstLevelTwo.id);

                        const levelThreeData = firstLevelTwo.child || [];
                        setLevelThree(levelThreeData);

                        if (levelThreeData.length > 0) {
                            setSelectedLevelThree(levelThreeData[0].id);
                        }
                    }
                }
            }

        } catch (error) {
            console.error("Error fetching employees:", error);
        }
    };

    const handleLevelOneChange = (e) => {
        const id = parseInt(e.target.value);
        setSelectedLevelOne(id);

        const selected = levelOne.find(item => item.id === id);
        const child = selected?.child || [];
        setLevelTwo(child);
        setLevelThree([]);
        setSelectedLevelTwo(null);
        setSelectedLevelThree("");
    };

    const handleLevelTwoChange = (e) => {
        const id = parseInt(e.target.value);
        setSelectedLevelTwo(id);

        const selected = levelTwo.find(item => item.id === id);
        const child = selected?.child || [];
        setLevelThree(child);
        setSelectedLevelThree("");
    };

    const handleLevelThreeChange = (e) => {
        setSelectedLevelThree(e.target.value);
    };

    const handleExploreNow = () => {
        navigate('/explore-all', { state: { selectedLevelOne: selectedLevelOne, selectedLevelTwo: selectedLevelTwo, selectedLevelThree: selectedLevelThree } })
    }


    return (
        <div className="domain-fliter" style={{ background: "#980808", padding: "20px" }}>
            <Grid2 container sx={{ display: "flex", justifyContent: "center", alignItems: 'center' }}>
                <Grid2 item size={{ xs: 12, sm: 6, md: 6, lg: 6 }} sx={{ mb: 4, background: "#fff", padding: "20px", boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px", borderRadius: '8px' }}>
                    <div>
                        {/* <h2 className='mobile-text-high' style={{
                            textTransform: "initial",
                            display: "flex", alignItems: "center", textAlign: "left", fontWeight: "bold", marginBottom: "15px", justifyContent: "left",
                        }}>Highly Rated Test Series Programs</h2> */}
                        <img src="/logo2.png" style={{ width: "100%", height: "350px", marginBottom :"15px" }} />
                    </div>
                    <Grid2 container>
                        <Grid2 item size={{ xs: 12, sm: 12, md: 12, lg: 12 }} sx={{ mb: 2 }}>
                            <FormControl component="fieldset">
                                <FormLabel component="legend" sx={{ color: '#000', fontWeight: 'bold' }}>Select Product Type</FormLabel>
                                <RadioGroup value={selectedLevelOne?.toString() || ""} onChange={handleLevelOneChange}>
                                    {levelOne.map(item => (
                                        <FormControlLabel
                                            key={item.id}
                                            value={item.id.toString()}
                                            control={<Radio />}
                                            label={item.name}
                                        />
                                    ))}
                                </RadioGroup>
                            </FormControl>
                        </Grid2>
                        <Grid2 item size={{ xs: 12, sm: 12, md: 12, lg: 12 }} sx={{ mb: 2 }}>
                            {levelTwo.length > 0 && (
                                <FormControl component="fieldset">
                                    <FormLabel component="legend" sx={{ color: '#000', fontWeight: 'bold' }}>Select Exam</FormLabel>
                                    <RadioGroup value={selectedLevelTwo?.toString() || ""} onChange={handleLevelTwoChange}>
                                        {levelTwo.map(item => (
                                            <FormControlLabel
                                                key={item.id}
                                                value={item.id.toString()}
                                                control={<Radio />}
                                                label={item.name}
                                            />
                                        ))}
                                    </RadioGroup>
                                </FormControl>
                            )}
                        </Grid2>
                        <Grid2 item size={{ xs: 12, sm: 6, md: 6, lg: 6 }} sx={{ mb: 2 }}>
                            {levelThree.length > 0 && (
                                <FormControl fullWidth margin="normal">
                                    <InputLabel>Select From Your Favorite Institute</InputLabel>
                                    <Select value={selectedLevelThree} onChange={handleLevelThreeChange} label="Select From Your Favorite Institute">
                                        {levelThree.map(item => (
                                            <MenuItem key={item.id} value={item.id}>
                                                {item.name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            )}
                        </Grid2>
                    </Grid2>
                    <Box sx={{ mt: 2, textAlign: 'center' }}>
                        <Button sx={{ background: "#114CAF", padding: "10px 50px", color: "#fff", fontWeight: "bold", fontSize: "12px", ml: 2 }} onClick={handleExploreNow}>Explore Now</Button>
                    </Box>
                </Grid2>
            </Grid2>
        </div>
    )
}