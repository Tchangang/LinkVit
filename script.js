$( document ).ready(function() {

	var timetowait = [];
	for(var i=0;i<100;i++){
		timetowait.push(2000+(i*100));
	}

	var smalltimetowait = [];
	for(var i=0;i<100;i++){
		smalltimetowait.push(400+(i*40));
	}

	var current_url = window.location.href;

	function getTimeToWait(){
		// On se la joue vraiment aleatoire jusqu'au 10eme de seconde :-)
		var pos = Math.ceil(Math.random() *(timetowait.length-1));
		return timetowait[pos]+Math.ceil(Math.random()*100)+Math.ceil(Math.random()*10)+Math.ceil(Math.random());
	}

	function getSmallTimeToWait(){
		var pos = Math.ceil(Math.random() *(smalltimetowait.length-1));
		return smalltimetowait[pos]+Math.ceil(Math.random()*10)+Math.ceil(Math.random());
	}

	var myregex = {
		firstname : new RegExp('%firstname%', 'g'),
		lastname : new RegExp('%lastname%', 'g'),
		fullname : new RegExp('%fullname%', 'g')
	};

	// Container principal (fenetre) qu'on va injecter dans l'etension 
	var maincontainer = 
	'<div id="linkevit_container" class="linkevit_draggable">'+
		'<div class="linkevit_logotext">'+
			"<span class='linkevit_logo'>Link'Vit</span>"+
			"<span class='linkevit_hide'>Close</span>"+
			'<div style="clear:both;"></div>'+
			'<div>Send mass invits and custom messages</div>'+
		'</div>'+
		'<div class="linkevit_label">'+
			'Search words <span class="linkevit_jobtitle">(in job title)</span>'+
		'</div>'+
		'<div class="linkevit_input">'+
			'<textarea name="linkevit_searchword" placeholder="Separate items with comma" rows="2"></textarea>'+
		'</div>'+
		'<div class="linkevit_label">'+
			'Rejected words <span class="linkevit_jobtitle">(in job title)</span>'+
		'</div>'+
		'<div class="linkevit_input">'+
			'<textarea name="linkevit_rejectword" placeholder="Separate items with comma" rows="2"></textarea>'+
		'</div>'+
		'<div class="linkevit_label">'+
			'Nb of invit to send'+
		'</div>'+
		'<div class="linkevit_input">'+
			'<input name="linkevit_nbtoadd" type="number">'+
		'</div>'+
		'<div class="linkevit_label">'+
			'Message'+
		'</div>'+
		'<div class="linkevit_input">'+
			'<textarea rows="2" name="linkevit_message" placeholder="Hello %firstname%, how are you ?"></textarea>'+
		'</div>'+
		'<div class="linkevit_button">'+
			'<button class="linkevit_validate search-result__actions--primary button-secondary-medium">Launch</button>'+
		'</div>'+
		'<div class="linkevit_footer">'+
			'Developped by Tchangang Boris-Emmanuel'+
			'<div><a href="mailto:tchangang.boris@gmail.com" target="_blank">tchangang.boris@gmail.com</a> | <a style="color:#4099FF;" href="https://twitter.com/boristchangang" target="_blank">@boristchangang</a></div>'+
		'</div>'+
	'</div>';
	// <span id="linkevit_apercu_message">aperçu</span>
	var mainmsg = '<div id="linkevit_msg"></div>';

	var leads = [];

	// detection clic sur aperçu du message
	// $('body').on('click','#linkevit_apercu_message',function(){
	// });

	// detection clic sur lien fermer de la poppup
	$('body').on('click','.linkevit_hide',function(){
		$('#linkevit_container').hide();
	});

	//detection clic sur bouton pour afficher la popup
	$('body').on('click','.linkevit_show',function(){
		$('#linkevit_container').show();
	});	

	//detection clic sur bouton pour lancer le script
	$('body').on('click','.linkevit_validate',function(){
		// alert('lancement du script');
		var max = parseInt($('input[name="linkevit_nbtoadd"]').val());
		var message = $('textarea[name="linkevit_message"]').val();
		if(message)
			message = message.trim();
			if(message.length==0)
				message = null;
			

		var search_term = $('textarea[name="linkevit_searchword"]').val();
		if(search_term){
			if(search_term.indexOf(',')!=1){
				search_term = search_term.split(',');
			}else{
				var temp = search_term;
				search_term = [];
				search_term.push(temp);
			}
		}else{
			search_term = [];
		}

		var rejected_term = $('textarea[name="linkevit_rejectword"]').val();
		if(rejected_term){
			if(rejected_term.indexOf(',')!=1){
				rejected_term = rejected_term.split(',');
			}else{
				var temp = rejected_term;
				rejected_term = [];
				rejected_term.push(temp);
			}
		}else{
			rejected_term = [];
		}

		console.log('Max invitations to send '+max);
		console.log('Search term ok  '+search_term);
		console.log('Rejected term not ok  '+rejected_term);

		if(!max)
			max = 1000;

		$("html, body").animate({
      		scrollTop: $(document).height()+800
    	}, 4000);


    	setTimeout(
	    	function(){
	    		leads = [];
	    		// Ici je sais que je peux continuer
	    		$('ul.results-list li .search-result__actions--primary').each(function(index){
					var obj  = {};
					obj.fullname = $(this).closest('ul.results-list li.search-result').find('a[data-control-name="search_srp_result"] .name-and-icon .name').text();
					obj.firstname = obj.fullname.split(' ')[0];
					obj.lastname = "";

					for(i in obj.fullname.split(' ')){
						if(i!=0){
							obj.lastname+=obj.fullname.split(' ')[i]+" ";
						}
					}
					obj.jobtitle = $(this).closest('ul.results-list li.search-result').find('p.subline-level-1').text();
					obj.id = $(this).closest('ul.results-list li.search-result').attr('id');
					
					console.log(obj.jobtitle);
					console.log(search_term);

					if(search_term.length>0){
						for(i in search_term){
							if(obj.jobtitle.trim().toLowerCase().indexOf(search_term[i].trim().toLowerCase())!=-1  && search_term[i].trim().length>0){
								obj.accept = true;
							}
						}
					}else{
						obj.accept = true;
					}
					if(rejected_term.length>0){
						for(i in rejected_term){
							if(obj.jobtitle.trim().toLowerCase().indexOf(rejected_term[i].trim().toLowerCase())!=-1 && rejected_term[i].trim().length>0){
								obj.accept = false;
							}
						}
					}

					if(message){
						var temp = message;
						temp = temp.replace(myregex.firstname,obj.firstname);
						temp = temp.replace(myregex.lastname,obj.lastname);
						temp = temp.replace(myregex.fullname,obj.fullname);
						obj.message = temp;
					}

					if(obj.accept){
						obj.timetowait = getTimeToWait();
						if(leads.length<max){
							// On ajoute les infos a notre tableau pour traiter tout ça plus tard
							leads.push(obj);
							console.log('************************************************');
							console.log('Accepted');
							console.log(obj);	
							console.log('************************************************');
						}
					}else{
						console.log('************************************************');
						console.log('Not accepted');
						console.log(obj);	
						console.log('************************************************');
					}
					if(index==$('ul.results-list li .search-result__actions--primary').length-1){
						//Fin des cocotiers
						// alert('finish');
						sendInvit(0);
					}
				});
	    	}, 5000
	    );
	});	
	
	function sendInvit(index){
		var button = '.search-result__actions button.search-result__actions--primary.button-secondary-medium';
		if(index<leads.length){
			$('#'+leads[index].id+' '+button).trigger('click');
			setTimeout(
		    	function(){
		    		// Ici je sais que je peux continuer, la popup est visible
		    		// Si on n'a pas de message à envoyer
		    		if(!leads[index].message) {
		    			// click on button send
		    			// $('.send-invite__actions button.button-primary-large').trigger('click');
		    			setTimeout(
    						function(){
    							sendInvit(index+1);
    						},1000
    					);
		    		}else if(leads[index].message.length>0){
		    			$('.send-invite__actions button.button-secondary-large').focus();
		    			$('.send-invite__actions button.button-secondary-large').trigger('click');
		    			setTimeout(
		    				function(){
		    					$('label #custom-message').val(leads[index].message);
		    					setTimeout(
		    						function(){
		    							sendInvit(index+1);
		    						},1000
		    					);
		    				},615+getSmallTimeToWait()
		    			);
		    		}else{
		    			setTimeout(
    						function(){
    							sendInvit(index+1);
    						},1000
    					);
		    		}
		    	}, 800+getSmallTimeToWait()
		    );
		}else{
			showMsg('Finish');
		}
	}

	function insertMainContainer(){
		// Ajout de notre div dans la page
		if($('.linkevit_draggable').length==0){
			$('body').prepend(maincontainer);
			$( ".linkevit_draggable").draggable();
		}
		if($('#linkevit_msg').length==0){
			$('body').prepend(mainmsg);
		}
	}

	function insertButton(){
		// bouton pour lancer notre popup
		if($('.linkevit_show').length==0){
			var mybutton = '<div style="text-align:right;padding-right:25px;"><button class="linkevit_show search-result__actions--primary button-secondary-medium">Launch Link\'Vit - Automatic invits</button></div>';
			$(mybutton).insertAfter($('.search-results__container header'));
		}
	}

	function initPage(){
		if(window.location.href.indexOf('search')!=-1){
			var cptloading = 0;
			var checkLoading = setInterval(
		    	function(){
		    		if($('ul.results-list li').length>0 && cptloading<50){
		    			clearInterval(checkLoading);
		    			setTimeout(
					    	function(){
					    		// Ici je sais que je peux continuer
					    		insertMainContainer();
								insertButton();
					    	}, 250
					    );
		    		}else if(cptloading>=50){
		    			// chargementProblematique();
		    			showMsg('A problem occured');
		    			clearInterval(checkLoading);
		    		}else{
		    			cptloading ++;
		    		}
		    	}, 500
		    );	
		}
	}

	initPage();
	// ************************************************
	// Detection page
	// ************************************************
	$("body").bind("DOMSubtreeModified", function() {
		// console.log($('div.search-results-container').hasClass('search-is-loading'));
	    if(window.location.href!=current_url){
			current_url = window.location.href;
			setTimeout(
		    	function(){
		    		initPage();
		    	}, 500
		    );
		}
	});

	function showMsg(msg){
		$('#linkevit_msg').html(msg);
		$('#linkevit_msg').show();
		setTimeout(
	    	function(){
	    		// Ici je sais que je peux continuer
	    		$('#linkevit_msg').hide();
	    	}, 1800
	    );
	}
});