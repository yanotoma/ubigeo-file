(function($) {
    
	$(document).ready(init);

	function init(){

		$('#btn-continue').click( () =>{

			$('.result-content').html('');

			const reader = new FileReader();
			let file = $('#file').prop('files');
			
			if(file.length == 0){
				alert('Debe seleccionar un archivo');
				return;
			}

			reader.readAsText(file[0]);

		    reader.onload = (event) => {
		        const result = event.target.result;
		        const allLines = result.split(/\r\n|\n/);
		        getData(allLines);
		        
		    };

		    reader.onerror = (evt) => {
		        alert(evt.target.error.name);
		    };

		} );

		function getData(lines){
			let departments = [];
			let provinces = [];
			let districts = [];

			for(let line of lines){
				if(line){
					//limpiar las comillas
					let sections = line.split('"');
					if(sections.length > 0){
						//si tenia las comillas, obtenemos lo del centro
						sections = sections[1];
					}
					sections = sections.split('/');

					//obtener el departamento
					let department = extractData(sections[0]);
					department.parent.code = '-';
					department.parent.name = '-';

					//buscar si existe
					let inxDeptartment = departments.findIndex( item => item.code == department.code);
					if(inxDeptartment < 0){
						//si el departamento no existe se agrega al array
						departments.push(department);
					}

					//obtener povincia
					let province = extractData(sections[1]);
					if(province){
						province.parent = department;	
						let inxProvince = provinces.findIndex( item => item.code == province.code);
						if(inxProvince < 0){
							//si la provincia no existe se agrega al array
							provinces.push(province);
						}

						//obtener distrito
						let district = extractData(sections[2]);
						if(district){
							district.parent = province;	
							let inxDistrict = districts.findIndex( item => item.code == district.code);
							if(inxDistrict < 0){
								districts.push(district);
							}
						}
					}
				}
			}

			showData('Departamentos', departments);
			showData('Provincias', provinces);
			showData('Distritos', districts);

		}

		function extractData(data){
			if(data.trim() == '') return null;
			data = data.trim().split(' ');
			return {
				code: data[0],
				name: data.slice(1).join(' '),
				parent: {} 
			}
		}

		function showData(title, list){

			let html = '<h3>' + title + '</h3>';
			html += '<table class="table">';
			html += '<thead>';
			html += '<tr>';
			html += '<th>Código</th>';
			html += '<th>Nombre</th>';
			html += '<th>Código Padre</th>';
			html += '<th>Descripción Padre</th>';
			html += '</tr>';
			html += '</thead>';

			html += '<tbody>';
			

			for(let row of list){
				html += '<tr>';	
				html += '<td>' + row.code + '</td>';
				html += '<td>' + row.name + '</td>';
				html += '<td>' + row.parent.code + '</td>';
				html += '<td>' + row.parent.name + '</td>';
				html += '</tr>';	
			}

			
			html += '</tbody>';

			html += '</table>'


			$('.result-content').append(html);
		}

	}

})(jQuery);