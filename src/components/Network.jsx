import { useParams } from "react-router-dom";
import axios from "axios";
import instId from "./InstituteId.jsx";
import Endpoints from "./Endpoints.jsx";

export default class Network {
    static COURSES_URL = Endpoints.baseURL + "admin/course/fetch-public/";
    static COURSE_CONTENT_URL =
        Endpoints.baseURL + "admin/course/fetchContent-public";
    static TAGS_LIST_URL = Endpoints.baseURL + "admin/course/fetch-tags-public/";
    static BUY_COURSE_URL =
        Endpoints.baseURL + "/admin/payment/fetch-public-checkout-url";
    static FETCH_IFRAME_URL = Endpoints.baseURL + "/admin/iframe/fetch";
    static FETCH_INSTITUTE_DETAILS =
        Endpoints.baseURL + "/getMetaData/fetch-institute";
    static FETCH_ADD_CLICK_URL = Endpoints.baseURL + "admin/add-click";
    static BUY_COURSE_SECOND_FORM = Endpoints.baseURL + "/admin/payment/fetch-public-checkout-url";
    static BANNER_URL = Endpoints.baseURL + "/admin/banner/fetch-public-banner/";
    static FETCH_PUBLIC_EMPLOYEE = Endpoints.baseURL + "/admin/employee/fetch-public-employee/";
    static FETCH_ANNOUNCEMENT_URL = Endpoints.baseURL + 'admin/announcement/fetch-active-announcement/';
    static FETCH_DOMAIN_URL = Endpoints.baseURL + 'domain/fetch-public?instId=';
    static FETCH_PUBLIC_COURSE_BY_ID_URL = Endpoints.baseURL + 'admin/course/fetch/'
    static BUY_COURSE_SECOND_URL = Endpoints.baseURL + "/admin/course/fetch";
    static FETCH_COURSE_SCHEDULR_URL = Endpoints.baseURL + "admin/course/fetchContent-public/";
    static FORM_SUBMIT_URL = Endpoints.baseURL + "/leadManagement/create-lead-form";


    static async submitForm(body) {
        let requestOptions = {
          withCredentials: false,
        };
        const response = await axios.post(this.FORM_SUBMIT_URL, body, requestOptions);
        return response.data;
      }


    static async getBuyCourseDetailsSecond(courseId) {
        let requestOptions = {
            // headers: { "X-Auth": token },
            withCredentials: false,
        };
        const response = await axios.get(
            this.BUY_COURSE_SECOND_URL + "/" + courseId,
            requestOptions
        );
        return response.data;
    }

    static async fetchCourseById(courseId) {
        // console.log("instId", instId);
        let requestOptions = {
            // headers: { "X-Auth": token },
            withCredentials: false,
        };
        const response = await axios.get(this.FETCH_PUBLIC_COURSE_BY_ID_URL + courseId, requestOptions);
        return response.data;
    };

    static async fetchCourses(instId) {
        // console.log("instId", instId);
        let requestOptions = {
            // headers: { "X-Auth": token },
            withCredentials: false,
        };
        const response = await axios.get(this.COURSES_URL + instId, requestOptions);
        return response.data;
    };
    static async fetchDomain() {
        // console.log("instId", instId);
        let requestOptions = {
            // headers: { "X-Auth": token },
            withCredentials: false,
        };
        const response = await axios.get(this.FETCH_DOMAIN_URL + instId, requestOptions);
        return response.data;
    };

    static async fetchAnnouncementUrl(instId) {
        let requestOptions = {
            // headers: { "X-Auth": token },
            withCredentials: false,
        };
        const response = await axios.get(
            this.FETCH_ANNOUNCEMENT_URL + instId,
            requestOptions
        );
        return response.data;
    }

    static async getTagsListApi(instId) {
        let requestOptions = {
            // headers: { "X-Auth": token },
            withCredentials: false,
        };
        const response = await axios.get(
            this.TAGS_LIST_URL + instId,
            requestOptions
        );
        return response.data;
    }

    static async fetchCourseContent(courseId, parentId) {
        let requestOptions = {
            // headers: { "X-Auth": token },
            withCredentials: false,
        };
        const response = await axios.get(
            this.COURSE_CONTENT_URL + "/" + courseId + "/" + parentId,
            requestOptions
        );
        return response.data;
    }


    static async fetchBannerss(instId) {
        let requestOptions = {
            // headers: { "X-Auth": token },
            withCredentials: false,
        };
        const response = await axios.get(
            this.BANNER_URL + "/" + instId,
            requestOptions
        );
        return response.data;
    }

    static async fetchInstituteDetail(instId) {
        let requestOptions = {
            // headers: { "X-Auth": token },
            withCredentials: false,
        };
        const response = await axios.get(
            this.FETCH_INSTITUTE_DETAILS + "/" + instId,
            requestOptions
        );
        return response.data;
    }

    static async fetchEmployee(instId) {
        // console.log("instId", instId);
        // let requestOptions = {
        //   // headers: { "X-Auth": token },
        //   withCredentials: false,
        // };
        const response = await axios.get(this.FETCH_PUBLIC_EMPLOYEE + instId,);
        return response.data;
    }

    static async fetchCheduleApi(courseId, contentId) {
        let requestOptions = {
            withCredentials: false,
        };
        const response = await axios.get(this.FETCH_COURSE_SCHEDULR_URL + courseId + '/' + contentId, requestOptions);

        return response.data;
    };

}
