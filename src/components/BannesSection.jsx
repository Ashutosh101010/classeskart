import React, { useEffect, useState } from "react";
import { Box, Button, Grid2, useMediaQuery } from "@mui/material";
import CustomCarousel from "./CustomCarosoul";
import Network from "./Network";
import instId from "./InstituteId";

export const Banners = ({ endpointsUrl, thirdFilter }) => {

  const isMobile = useMediaQuery("(min-width:600px)");
  const [banners, setBanners] = useState([]);

  useEffect(() => {
    getBanners();
  }, []);

  const getBanners = async () => {
    try {
      const response = await Network.fetchBannerss(instId);
      const fetchedBanners = response.banners || [];

      // Filter banners based on domain id match with thirdFilter.id
      const filteredBanners = fetchedBanners.filter(banner =>
        banner.domains?.some(domain => domain.id === thirdFilter)
      );

      if (filteredBanners.length > 0) {
        // Repeat first banner at the end for carousel looping
        const extendedBanners = [...filteredBanners, filteredBanners[0]];
        setBanners(extendedBanners);
      } else {
        setBanners([]);
      }
    } catch (error) {
      console.error('Failed to fetch banners:', error);
      setBanners([]);
    }
  };



  return (
    <div className="text-center">
      <div className="">
        <div className="col-xs-12 col-md-12 col-lg-12" style={{ marginTop: '15px', marginBottom: "10px" }}>
          <div style={{ paddingLeft: isMobile ? '0rem' : '0rem', paddingRight: isMobile ? '0rem' : '0rem', paddingTop: isMobile ? '0rem' : '1rem', paddingBottom: isMobile ? '4rem' : '0rem' }}>
            {banners?.length > 0 && (
              <Grid2 container>
                <Grid2 item size={{ xs: 12, sm: 12, md: 12, lg: 12 }} sx={{
                  // background: '#b7b2b221', 
                  width: "100%", borderRadius: "15px"
                }}>
                  <CustomCarousel banners={banners} setBanners={setBanners} endpointsUrl={endpointsUrl} />
                </Grid2>
              </Grid2>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};
