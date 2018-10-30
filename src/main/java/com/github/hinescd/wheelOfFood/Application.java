package com.github.hinescd.wheelOfFood;

import java.util.ArrayList;
import java.util.Map;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.stereotype.Controller;
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
		parameterMap.put("limit", "50");
		if(parameterMap.containsKey("term")) {
			parameterMap.put("sort_by", "best_match");
		} else {
			parameterMap.put("sort_by", "rating");
		}
		
		String apiKey = System.getenv("apiKey");
		
		if(apiKey == null || apiKey.length() == 0) {
		  System.err.println("Got empty API key");
		  return new ArrayList<Business>();
		}
		
		HttpHeaders headers = new HttpHeaders();
		headers.add("Authorization", "Bearer " + apiKey);
		
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
}
