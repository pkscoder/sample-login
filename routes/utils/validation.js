exports.user = function(data){
	var isError = false,
		errorData = [];

	var jsonData = {
		name 			: data.name || '',
    	password		: data.password || '',
    	email 			: data.username ? data.username.toLowerCase().trim() : '',
    	phone 			: data.phone || ''
	};

	if(jsonData.name == ''){
		isError = true;
		errorData.push({
			'valueOf': 'name',
			'message': 'name is empty'
		});
	}

	if(jsonData.password == ''){
		isError = true;
		errorData.push({
			'valueOf': 'password',
			'message': 'password is empty'
		});
	}

	if(jsonData.email == ''){
		isError = true;
		errorData.push({
			'valueOf': 'email',
			'message': 'email is empty'
		});
	}

	if(jsonData.phone == ''){
		isError = true;
		errorData.push({
			'valueOf': 'phone',
			'message': 'phone is empty'
		});
	}

	if(isError){
		return {'status': 'invalid', 'data': errorData};
	}else{
	    return {'status': 'verified', 'data': jsonData};
	}
};