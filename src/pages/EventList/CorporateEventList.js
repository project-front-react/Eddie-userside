import React, { useEffect, useMemo, useState } from "react";
import Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer";

import "./EventList.scss";
import { getTranslatedText as t } from "../../translater/index";
import Sidebar from "../../components/sidebar/Sidebar";
import EventsSlider from "../../components/EventsSlider/EventsSlider";
import FilterSelect from "../../components/FilterSelectMenu/FilterSelectMenu";
import CustomPagination from "../../components/CustomPagination/CustomPagination";
import EventBanner from "../../assets/images/events1.jpg";
import { Link } from "react-router-dom";
import { getAllCorporateEvent, getAllEvent, getNews } from "../../services/eddiServices";
import { useDispatch, useSelector } from "react-redux";
import { getAllEvents } from "../../redux/actions";
import api from "../../api";
import Loader from "../../components/Loader/Loader";
import NewsSlider from "../../components/EventsSlider/NewsSlider";

const CorporateEventList = () => {
  const dispatch = useDispatch();
  const state = useSelector((state) => state?.Eddi);
  let lan = state?.language;
  const [allEventList, setAllEventList] = useState();
  const [totalEventCount, setTotalEventCount] = useState(0);
  const [selectedTimeFilter, setSelectedTimeFilter] = useState("Newest");
  const [allNewsList, setAllNewsList] = useState();
  const [selectedTypeFilter, setSelectedTypeFilter] = useState("Event");
  const [featuredEvent, setFeaturedEvent] = useState([]);
  const [filteredData, setFilteredData] = useState();
  const [paginationStartIndex, setPaginationStartIndex] = useState(1);
  const [paginationEvents, setPaginationEvents] = useState();
  const [isLoader, setIsLoader] = useState(false);

  const weekday = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  useEffect(() => {
    setIsLoader(true);
    getAllCorporateEvent().then(async (result) => {
      setIsLoader(false);
      if (result.status == "success") {
        let featuredEvent = [];
        let countResult = [];
        await result?.data?.map((data, i) => {
          if (
            data?.event_choose_type == "Event" &&
            data?.status?.value == "Active"
          ) {
            countResult.push(data);
          }
          if (
            data?.event_choose_type == "Event" &&
            data?.is_featured == true &&
            data?.status?.value == "Active"
          ) {
            featuredEvent.push(data);
          }
        });
        let allEvents = countResult;

        setAllEventList(allEvents);
        setTotalEventCount(allEvents?.length);
        setFeaturedEvent(featuredEvent);
      }
    });
    getAllNews()
  }, []);


const getAllNews =()=>{
setIsLoader(true)
getNews(true).then((res)=>{
  if(res?.status == 'success'){
    setAllNewsList(res?.data)
  }
}).catch((e)=>console.log(e)).finally(()=>setIsLoader(false))
}

  useEffect(() => {
    filteredEvent();
  }, [selectedTimeFilter,selectedTypeFilter,allNewsList, allEventList]);

  const filteredEvent = () => {
    let sorted = [];
    if(selectedTypeFilter === 'Event'){
      sorted =allEventList;
    }else{
      sorted=  allNewsList ;
    }

    if (selectedTimeFilter == "Newest") {
      sorted = sorted?.sort(courseComparisonbyNewestDate);
    } else {
      sorted = sorted?.sort(courseComparisonbyOldestDate);
    }
    setFilteredData(sorted);
  };

  function courseComparisonbyNewestDate(a, b) {
    const date1 = new Date(b?.created_date_time);
    const date2 = new Date(a?.created_date_time);

    return date1 - date2;
  }
  function courseComparisonbyOldestDate(a, b) {
    const date1 = new Date(b?.created_date_time);
    const date2 = new Date(a?.created_date_time);

    return date2 - date1;
  }

  //Pagination

  const paginationPrev = () => {
    setPaginationStartIndex(paginationStartIndex - 12);
  };
  const paginationNext = () => {
    setPaginationStartIndex(paginationStartIndex + 12);
  };

  const pagination = () => {
    const paginationData = [];
    const actualIndex = paginationStartIndex - 1;
    filteredData?.map((data, i) => {
      if (i >= actualIndex && i <= actualIndex + 12) {
        paginationData.push(data);
      }
    });

    setPaginationEvents(paginationData);
    // dispatch(getAllEvents(paginationData));
  };

  useEffect(() => {
    pagination();
  }, [paginationStartIndex, filteredData, selectedTimeFilter]);
  console.log("pagination event", paginationEvents);
  return (
    <div className="UserDashboard">
      <Header />
      <div className="main-content">
        <div className="leftSider">
          <Sidebar />
        </div>
        <div className="right-content">
          <div className="container">
            <div className="row">
              <div className="brdcumb-block">
                <div>
                  <Link className="brd-link" to="/corporate-user-dashboard">
                    {" "}
                    {t("Dashboard", lan)}{" "}
                  </Link>
                  |
                  <span className="brd-link text-green">
                    {" "}
                    {t("OrgEventNews", lan)}
                  </span>
                </div>
                <Link to="/corporate-user-dashboard" className="brd-link">
                  {t("Back", lan)}
                </Link>
              </div>
            </div>
            <div className="mt-3">
              {featuredEvent.length > 0 && (
                <div
                  className="feature-event"
                  style={{
                    backgroundImage: featuredEvent[0]?.event_image
                      ? `url(${featuredEvent[0]?.event_image})`
                      : `url(${EventBanner})`,
                  }}
                >
                  <span style={{ backgroundColor: "#000" }}></span>
                  <div className="col-md-12 col-12 mx-auto text-center banner-content">
                    <h2>{featuredEvent[0]?.event_name || "-"}</h2>
                    <h2>
                      On{" "}
                      {new Date(featuredEvent[0]?.created_date_time).getDate()}{" "}
                      {
                        monthNames[
                          new Date(
                            featuredEvent[0]?.created_date_time
                          ).getMonth()
                        ]
                      }{" "}
                      {new Date(
                        featuredEvent[0]?.created_date_time
                      ).getFullYear()}
                    </h2>
                    <Link
                      to={`/user-dashboard/event-details/${featuredEvent[0]?.uuid}?is_corporate=1`}
                      className="btn btn-white-border"
                    >
                      {t("REGISTERNOW", lan)}
                    </Link>
                  </div>
                </div>
              )}
            </div>
            <div className="mt-4 event-list-main">
              <div className="section-title">
                <div className="d-flex flex-column">
                  <h1>
                    {t("ThriveintheSector", lan)}
                    <span> That Runs Business</span>
                  </h1>
                  <p className="mt-0">
                    {selectedTypeFilter === 'Event' && t("RegisterfortheupcomingEvents", lan)}
                  </p>
                </div>
                <div className=" d-flex gap-3">
                  <FilterSelect
                    value={["Event", "News"]}
                    placeholder=""
                    selected={selectedTypeFilter}
                    isWithicon
                    onChange={(e) => setSelectedTypeFilter(e.target.value)}
                  />
                  <FilterSelect
                    value={["Newest", "Oldest"]}
                    selected={selectedTimeFilter}
                    placeholder="Filter by"
                    isWithicon
                    onChange={(e) => setSelectedTimeFilter(e.target.value)}
                  />
                </div>
              </div>

              <div className="section-title-Showevent my-3">
                <div className="d-flex flex-column">
                  <h3>{selectedTypeFilter === 'Event' ? t("ShowingAllEvents", lan) :t("ShowingAllNews", lan)}</h3>
                </div>
                <div className="">{selectedTypeFilter === 'Event' ? totalEventCount : allNewsList.length} {t(selectedTypeFilter,lan)} {t("Found",lan)}</div>
              </div>
              {selectedTypeFilter==='Event'? <div>
                <EventsSlider
                  dots={true}
                  data={paginationEvents?.slice(0, 6)}
                  is_corporate={true}
                />
                <EventsSlider
                  dots={true}
                  data={paginationEvents?.slice(6, 12)}
                  is_corporate={true}
                />
              </div> :
              <div>
                   <NewsSlider
                   dots={true}
                   data={paginationEvents?.slice(0, 6)}
                   is_corporate={true}
                 />
                 <NewsSlider
                   dots={true}
                   data={paginationEvents?.slice(6, 12)}
                   is_corporate={true}
                 />
               </div>
              }

              <div className="text-end mt-2..">
                {totalEventCount > 12 && (
                  <CustomPagination
                    startIndex={paginationStartIndex}
                    endIndex={
                      paginationStartIndex + 11 > filteredData?.length
                        ? filteredData?.length
                        : paginationStartIndex + 11
                    }
                    totalData={filteredData?.length}
                    onPrev={paginationPrev}
                    onNext={paginationNext}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
        {isLoader ? <Loader /> : ""}
        <Footer isSmallFooter />
      </div>
    </div>
  );
};

export default CorporateEventList;
