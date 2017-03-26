package com.github.hinescd.wheelOfFood;

import com.fasterxml.jackson.annotation.JsonProperty;

public class BusinessLocation {
	
	@JsonProperty("display_address")
	private String[] address;

	public String[] getAddress() {
		return address;
	}

	public void setAddress(String[] address) {
		this.address = address;
	}

}
