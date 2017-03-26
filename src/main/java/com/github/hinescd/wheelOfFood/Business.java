package com.github.hinescd.wheelOfFood;

import com.fasterxml.jackson.annotation.JsonProperty;

public class Business {
	
	@JsonProperty("display_phone")
	private String phone;
	
	@JsonProperty("review_count")
	private int reviewCount;
	
	private String url;
	private String image_url;
	private BusinessLocation location;
	private String name;
	private String price;
	private double rating;
	
	public String getPhone() {
		return phone;
	}
	public void setPhone(String phone) {
		this.phone = phone;
	}
	public int getReviewCount() {
		return reviewCount;
	}
	public void setReviewCount(int reviewCount) {
		this.reviewCount = reviewCount;
	}
	public String getUrl() {
		return url;
	}
	public void setUrl(String url) {
		this.url = url;
	}
	public String getImage_url() {
		return image_url;
	}
	public void setImage_url(String image_url) {
		this.image_url = image_url;
	}
	public BusinessLocation getLocation() {
		return location;
	}
	public void setLocation(BusinessLocation location) {
		this.location = location;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public String getPrice() {
		return price;
	}
	public void setPrice(String price) {
		this.price = price;
	}
	public double getRating() {
		return rating;
	}
	public void setRating(double rating) {
		this.rating = rating;
	}

}
