function displayProduceList() {
  $.get("/i", function (json) {
    $.each(json.ingredients, function (idx, ingredient) {
      addProduce(ingredient.name, ingredient.icon, ingredient.count.number, ingredient.count.unit);
    });
  });
}


function displayProduceAtZero() {
  $.get("/i?count=0", function (json) {
		if (json.ingredients.length == 0) {
			$('#emptyWarning').css('display', '');
		} else {
			$.each(json.ingredients, function (idx, ingredient) {
				if (ingredient.count.number == 0)
					addProduce(ingredient.name, ingredient.icon, ingredient.count.number, ingredient.count.unit);
			});
		}
    
  });
}


function addProduce(name, image, count, unit) {
  $(".produce-tile").first().clone().insertBefore(".produce-new");
  if (count == 0) $('.produce-tile').last().addClass("depleted");
  var identifier = `${name.replace(' ', '-')}-product`;
  $('.produce-tile').last().attr('id', identifier);
	$('.produce-tile').last().click(() => {
		// document.getElementById(identifier).toggleAttribute('produce-edit')
		$(`#${identifier}`).toggleClass('produce-edit');
	});
  $('.produce-tile .produce-name').last().text(name);
  $('.produce-tile .produce-image').last().attr("src", "assets/" + image + ".png");
  $('.produce-tile .produce-count').last().text(count);
  $('.produce-tile .produce-unit').last().text(unit);
  $('.produce-tile .produce-subtract').last().click(function (e) {
		e.stopPropagation();
    var currentAmount = Number($(`#${identifier} .produce-count`).text()) - 1;
    if (currentAmount <= -1) return;
    $(`#${identifier} .produce-count`).text(currentAmount);

    $.post('/i', { name: $(`#${identifier} .produce-name`).text(), count: { number: currentAmount || 0 } }, function (result) {
      console.log(result);
			if (currentAmount == 0) location.reload();
      // location.reload()
    });
  });
  $('.produce-tile .produce-add').last().click(function (e) {
		e.stopPropagation();
    var currentAmount = Number($(`#${identifier} .produce-count`).text()) + 1;
    $(`#${identifier} .produce-count`).text(currentAmount);

    $.post('/i', { name: $(`#${identifier} .produce-name`).text(), count: { number: currentAmount || 0 } }, function (result) {
      // console.log(result);
			if (currentAmount == 1) location.reload(); 
      // location.reload()
    });
  });
  $('.produce-tile .produce-delete').last().click(function (e) {
		e.stopPropagation();
    $.ajax({
      url: `/i?name=${$(`#${identifier} .produce-name`).text()}`,
      type: 'DELETE',
      complete: () => location.reload()
    });
  });
}


function saveProduce(name, image, count, unit) {
  var promise = $.ajax({
    url: '/i',
    type: 'POST',
    dataType: "json",
    contentType: "application/json; charset=utf-8",
    data: JSON.stringify({
      "name": name,
      "count": {
        "number": count,
        "unit": unit
      },
      "expiry_date": 1614955292451,
      "icon": image
    })
  });
}

function populateDB() {

  $.get('/i', function (result) {
    if (result.ingredients.length > 0) return;
    saveProduce("sandwiches", "sandwich", "4", "");
    saveProduce("spices", "spices", "12", "");
    saveProduce("tomatoes", "tomato", "6", "");
    saveProduce("steaks", "steak", "4", "lbs");
    saveProduce("toast", "toast", "24.2", "slices");
    saveProduce("bread", "baguette", "1.5", "");
    saveProduce("sushi", "sushi", "5", "");
    saveProduce("orange", "orange", "3", "");
    saveProduce("pasta", "pasta", "10", "oz");
    saveProduce("pizza", "pizza", "2", "");
    saveProduce("cheese", "cheese", "0", "Lbs");
  });

}

