package com.github.hinescd.wheelOfFood;

import java.util.ArrayList;
import java.util.Map;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Controller;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.client.RestTemplate;

@Controller
@SpringBootApplication
public class Application {
	
	@RequestMapping(value="/search", method=RequestMethod.GET, produces="application/json")
	@ResponseBody
	public ArrayList<Business> search(@RequestParam Map<String, String> parameterMap) {
		
		if(!parameterMap.containsKey("location") && (!parameterMap.containsKey("longitude") || !parameterMap.containsKey("latitude"))) {
			return null;
		}
		
		parameterMap.put("categories", "restaurants");
		parameterMap.put("sort_by", "rating");
		parameterMap.put("limit", "50");
		
		AccessToken accessToken = getAccessToken();
		
		HttpHeaders headers = new HttpHeaders();
		headers.add("Authorization", accessToken.getTokenType() + " " + accessToken.getAccessToken());
		
		String url = "https://api.yelp.com/v3/businesses/search?";
		for(String key : parameterMap.keySet()) {
			url += key + "=" + parameterMap.get(key) + "&";
		}
		url = url.substring(0, url.length() -1);
		
		HttpEntity<Object> requestEntity = new HttpEntity<Object>(headers);
		
		RestTemplate restTemplate = new RestTemplate();
		
		try {
			SearchResults request = restTemplate.exchange(url, HttpMethod.GET, requestEntity, SearchResults.class).getBody();
			return request.getBusinesses();
		} catch(Exception e) {
			e.printStackTrace();
			return new ArrayList<Business>();
		}
	}

	public static void main(String[] args) {
		SpringApplication.run(Application.class, args);
	}
	
	private AccessToken getAccessToken() {
		HttpHeaders headers = new HttpHeaders();
		headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);
		
		MultiValueMap<String, String> map = new LinkedMultiValueMap<String, String>();
		map.add("grant_type", "client_credentials");
		map.add("client_id", "jEJZOTkJLXUFIiggMq5e8A");
		map.add("client_secret", "ig15o1jYvd7n3xgBCxOFk9cKCuH9hmeeop2jBOR4AH6SvRVrmmVe4IzGySyqntkR");
		
		HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<MultiValueMap<String, String>>(map, headers);
		
		RestTemplate restTemplate = new RestTemplate();
		AccessToken response = restTemplate.postForObject("https://api.yelp.com/oauth2/token", request, AccessToken.class);
		return response;
	}
}
