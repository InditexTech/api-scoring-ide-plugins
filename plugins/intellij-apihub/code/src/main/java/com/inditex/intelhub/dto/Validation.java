package com.inditex.intelhub.dto;

import com.google.gson.annotations.Expose;

@SuppressWarnings("unused")
public class Validation {

    @Expose
    private String rating;
    @Expose
    private String ratingDescription;
    @Expose
    private Double score;

    public String getRating() {
        return rating;
    }

    public void setRating(String rating) {
        this.rating = rating;
    }

    public String getRatingDescription() {
        return ratingDescription;
    }

    public void setRatingDescription(String ratingDescription) {
        this.ratingDescription = ratingDescription;
    }

    public Double getScore() {
        return score;
    }

    public void setScore(Double score) {
        this.score = score;
    }

}
