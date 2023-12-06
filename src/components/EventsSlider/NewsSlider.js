import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./EventsSlider.scss";
import IcCal from "../../assets/images/IcCalendar.svg";
import Slider from "react-slick";
import CourseImage from "../../assets/images/CourseImage.jpg";
import ErrorImage from "../../assets/images/ErrorImage.svg";
import { getTranslatedText as t } from "../../translater/index";
import { useSelector } from "react-redux";
import { showShorttext } from "../../services/constant";

function NewsSlider(props) {
	const state = useSelector((state) => state?.Eddi);
	let lan = state?.language;

	const NewestArticle = {
		dots: props?.dots || false,
		speed: 500,
		infinite: false,
		slidesToShow: 4,
		slidesToScroll: 1,
		arrows: props?.arrows|| false,
		responsive: [
			{
				breakpoint: 1024,
				settings: {
					slidesToShow: 3,
					slidesToScroll: 3,
					dots: props?.dots || false,
				},
			},
			{
				breakpoint: 800,
				settings: {
					slidesToShow: 2,
					slidesToScroll: 2,
					initialSlide: 2,
					dots: props?.dots || false,
				},
			},
			{
				breakpoint: 480,
				settings: {
					slidesToShow: 1,
					slidesToScroll: 1,
					arrows:true,
					infinite: true,
					dots: props?.dots || false,
				},
			},
		],
	};

	return (
		<div className="Event-main">
			<div className="section-title">
				<h1>{props.name}</h1>
				{/* <Link className="link-green">{t("AllNews", lan)}</Link> */}
			</div>
			<Slider {...NewestArticle}>
				{props?.data?.map((EventListData, index) => {
					return (
						<div key={index}>
							<div className="Event-block">
								<div className="col-12">
									<div className="position-relative Event-box mx-3">
										<div className="position-relative">
											<img
												src={
													EventListData?.news_image|| CourseImage
												}
												className="w-100 banner-box"
												onError={({ currentTarget }) => {
													currentTarget.onerror = null; // prevents looping
													currentTarget.src = ErrorImage;
												}}
											/>
											
										</div>
										<div className="Event-details">
											<h4
												style={{
													color: `rgba(72, 26, 32, 1)`,
												}}
											>
												{EventListData[`news_title_${lan}`] || "-"}
											</h4>
											<h6>{t("By",lan)} {EventListData?.news_author?.first_name || "-"}</h6>
											<div className="event-date">
												<span>
													<img
														src={IcCal}
														style={{ width: "10px", marginRight: "5px" }}
													/>
												</span>
												<span>
													{new Date(EventListData?.created_date_time)?.toDateString()  || "-"}
												</span>
											</div>
											<p className="unset-list main-desc"
												dangerouslySetInnerHTML={{
													__html: showShorttext(EventListData[`news_short_description_${lan}`],40) || "-",
												}}
											></p>
											<Link
												className="btn btn-green w-100"
												to={`/user-dashboard/news-details/${
													EventListData?.uuid
												}`}
											>
												{t("View", lan)}
											</Link>
										</div>
									</div>
								</div>
							</div>
						</div>
					);
				})}
			</Slider>
		</div>
	);
}

export default NewsSlider;
