import { Box, Button, Card, Checkbox, FormHelperText, Grid, IconButton, InputAdornment, InputLabel, OutlinedInput, TextField, Typography } from "@mui/material";
import React from "react";
// import CheckIcon from '@mui/icons-material/Check';

const EnrolledNowForm = ({setTitle, title, handleNumberChange, number, error, setEmail, email, orderBumpCourse, checked, handleCheckboxChange, isCouponValid, errorMessage, totalPrice, couponDiscount, handleSubmit, handleReedemCode, isMobileDevice, reedemCode, couponNumber, handleCoupon, handleCheckCoupon, getColor}) => {

    console.log('totalPrice', totalPrice);
    console.log('orderBumpCourse', orderBumpCourse);
    
    return (
        <React.Fragment>
            <Typography sx={{ mt: 3, mb: 1, py: 1 }}>
                <Card sx={{ width: "100%", boxShadow: "none", textAlign: "center", mb: 3 }}>
                    <Typography padding={1} mt={3} fontWeight={'bold'} variant='h5'>
                        Please fill this details
                    </Typography>
                    <Grid container sx={{ margin: "20px 0", justifyContent: "center", pl:1, pr:1 }}>
                        <Grid item xs={12} sm={10} md={10} lg={10}>
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
                                                        {isCouponValid === true ? <>Applied</> : "Apply"}
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
                            <Box className="total-price" sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                margin: "16px",
                                // width: "100%"
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
        </React.Fragment>
    )
};

export default EnrolledNowForm;