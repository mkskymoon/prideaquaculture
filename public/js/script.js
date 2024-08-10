
function openMenu() {
    let menu1 = document.getElementById('menu');
    let menuBtn = document.querySelector('.menuBtn');
    let closeBtn = document.querySelector('.closeBtn');
    menu1.style.display = 'block';
    menuBtn.style.display = 'none';
    closeBtn.style.display = 'block';
    document.body.classList.add("menu-open");
}
function closeMenu() {
    let menu2 = document.getElementById('menu');
    let menuBtn = document.querySelector('.menuBtn');
    let closeBtn = document.querySelector('.closeBtn');
    menu2.style.display = 'none';
    menuBtn.style.display = 'block';
    closeBtn.style.display = 'none';
    document.body.classList.remove("menu-open");
}




function calculatefeed() {
    var a;
    var b;
    var result;
    a = parseInt(document.getElementById('fishestank').value);
    b = parseInt(document.getElementById('fishweight').value);
    result = a * b;
    if (b > 0 && b <= 20) {
        var total6 = result * 6 / 100;
        document.getElementById("feedcal").innerHTML = total6.toFixed(2) + "  " + "grams per day";
        document.getElementById("feedcals").innerHTML = (total6 / 1000).toFixed(2) + "  " + "kilograms per day";
        return false;
    }
    else if (b >= 21 && b <= 50) {
        var total5 = result * 5 / 100;
        document.getElementById("feedcal").innerHTML = total5.toFixed(2) + "  " + "grams per day";
        document.getElementById("feedcals").innerHTML = (total5 / 1000).toFixed(2) + "  " + "kilograms per day";
        return false;
    }
    else if (b >= 51 && b <= 100) {
        var total4 = result * 4 / 100;
        document.getElementById("feedcal").innerHTML = total4.toFixed(2) + "  " + "grams per day";
        document.getElementById("feedcals").innerHTML = (total4 / 1000).toFixed(2) + "  " + "kilograms per day";
        return false;
    }
    else if (b >= 101 && b <= 200) {
        var total3 = result * 3 / 100;
        document.getElementById("feedcal").innerHTML = total3.toFixed(2) + "  " + "grams per day";
        document.getElementById("feedcals").innerHTML = (total3 / 1000).toFixed(2) + "  " + "kilograms per day";
        return false;
    }
    else if (b >= 201 && b <= 300) {
        var total2 = result * 2 / 100;
        document.getElementById("feedcal").innerHTML = (total2).toFixed(2) + "  " + "grams per day";
        document.getElementById("feedcals").innerHTML = (total2 / 1000).toFixed(2) + "  " + "kilograms per day";
        return false;
    }
    else if (b >= 301 && b <= 400) {
        var total1 = result * 1.5 / 100;
        document.getElementById("feedcal").innerHTML = (total1).toFixed(2) + "  " + "grams per day";
        document.getElementById("feedcals").innerHTML = (total1 / 1000).toFixed(2) + "  " + "kilograms per day";
        return false;
    }
    else {
        var total = result * 1 / 100;
        document.getElementById("feedcal").innerHTML = (total).toFixed(2) + "  " + "grams per day";
        document.getElementById("feedcals").innerHTML = (total / 1000).toFixed(2) + "  " + "kilograms per day";
        return false;
    }


}

function calculateammonia() {
    var feed;
    var weight;
    var feedweight;
    var totalkilograms;
    feed = parseInt(document.getElementById("feed").value);
    weight = parseInt(document.getElementById("feedweight").value);
    feedweight = feed * weight / 1000;
    totalkilograms = feedweight / 1000;
    document.getElementById("ammoniacal").innerHTML = feedweight + "  " + "grams per day";
    document.getElementById("ammoniacals").innerHTML = totalkilograms.toFixed(2) + "  " + "Kilograms per day";
    return false;


}


function roundtankwater() {
    var dia;
    var hei;
    var t;
    var totalh;
    var tot;
    var totalliters
    dia = parseInt(document.getElementById("roundtank").value);
    hei = parseInt(document.getElementById("roundheight").value);
    t = dia ** 2;
    tot = t * hei;
    totalh = (0.786 * tot);
    totalliters = totalh * 28.7;

    document.getElementById("roundcalses").innerHTML = (totalliters).toFixed(2) + "  " + "liters in tank";
    document.getElementById("roundcalse").innerHTML = (totalliters / 3.785).toFixed(2) + "  " + "US Gal";
    return false;
}

function squaretankwater() {
    var height;
    var length;
    var width;
    var totalsquare;
    var total_liters;
    height = parseInt(document.getElementById("squareheight").value);
    length = parseInt(document.getElementById("squarelength").value);
    width = parseInt(document.getElementById("squarewidth").value);
    totalsquare = height * length * width;
    total_liters = totalsquare * 28.7;

    document.getElementById("squareinliters").innerHTML = (total_liters).toFixed(2) + "  " + "liters in tank";
    document.getElementById("squareingals").innerHTML = (total_liters / 3.785).toFixed(2) + "  " + "US Gal";
    return false;

}



























