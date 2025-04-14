
import { Box, Button, FormControl, FormControlLabel, FormLabel, Grid2, InputLabel, MenuItem, Radio, RadioGroup, Select, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import Network from "./Network";
import { useNavigate } from "react-router-dom";
import instId from "./InstituteId";

export default function DomainFilter() {

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

    const slugify = (text) => {
        return text
            .toString()
            .toLowerCase()
            .trim()
            .replace(/\s+/g, '-')           // Replace spaces with -
            .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
            .replace(/\-\-+/g, '-');        // Replace multiple - with single -
    };

    const handleExploreNow = () => {
        const selectedInstitute = levelThree.find(item => item.id === selectedLevelThree);
        const instituteSlug = selectedInstitute ? slugify(selectedInstitute.name) : 'unknown';
        navigate(`/${instituteSlug}`, { state: { selectedLevelOne: selectedLevelOne, selectedLevelTwo: selectedLevelTwo, selectedLevelThree: selectedLevelThree } })
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
                        <img src="/Rectangle 2792.png" style={{ width: "100%", marginBottom: "15px" }} />
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