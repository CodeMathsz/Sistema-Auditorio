package br.com.senaisp.sistemaauditorio.model;

import org.springframework.http.HttpStatus;

import lombok.Data;

@Data
public class Sucesso {

	private HttpStatus error;
	private String message;
	
	public Sucesso(HttpStatus error, String message) {
		this.error = error;
		this.message = message;
	}
}
