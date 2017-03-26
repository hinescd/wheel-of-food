package com.github.hinescd.wheelOfFood;

import com.fasterxml.jackson.annotation.JsonProperty;

public class AccessToken {
	
	@JsonProperty("expires_in")
	private int expiresIn;
	
	@JsonProperty("token_type")
	private String tokenType;
	
	@JsonProperty("access_token")
	private String accessToken;
	
	public int getExpiresIn() {
		return expiresIn;
	}
	
	public void setExpiresIn(int expiresIn) {
		this.expiresIn = expiresIn;
	}
	
	public String getTokenType() {
		return tokenType;
	}
	
	public void setTokenType(String tokenType) {
		this.tokenType = tokenType;
	}
	
	public String getAccessToken() {
		return accessToken;
	}
	
	public void setAccessToken(String accessToken) {
		this.accessToken = accessToken;
	}
	
	public String toString() {
		return getAccessToken();
	}

}
