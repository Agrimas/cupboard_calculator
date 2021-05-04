'use strict'
const Form = document.forms.cupboardForm;

// Общие функции
function removeThisTypeElem(event) {
    const fieldset = event.target.closest('fieldset');
    switch (fieldset.getAttribute('type')) {
        case 'doors':
            doorsTypes = doorsTypes.filter((value) => value !== fieldset.id);
            break;
        case 'antresol':
            antresolTypes = antresolTypes.filter((value) => value !== fieldset.id);
            break;
        case 'builtinTumba':
            builtinTumbaTypes = builtinTumbaTypes.filter((value) => value !== fieldset.id);
            break;
        case 'rail':
            railTypes = railTypes.filter((value) => value !== fieldset.id);
            break;
        case 'metalStructures':
            metalStructuresTypes = metalStructuresTypes.filter((value) => value !== fieldset.id);
            break;
        case 'mirror':
            mirrorTypes = mirrorTypes.filter((value) => value !== fieldset.id);
            break;
        case 'backlight':
            backlightTypes = backlightTypes.filter((value) => value !== fieldset.id);
            break;
        default:
            break;
    }

    fieldset.remove();
}



// Шкаф
Form.loginInstagram.focus();
Form.widthCupboard.addEventListener('input', recountWidthCompartment);
Form.countCompartment.addEventListener('input', recountWidthCompartment);
Form.widthCompartment.addEventListener('input', recountWidthCompartment);
function recountWidthCompartment() {
    if (Form.widthCupboard.value && Form.countCompartment.value) {
        Form.widthCompartment.value = Math.round(+Form.widthCupboard.value / +Form.countCompartment.value);
    } else {
        Form.widthCompartment.value = 0;
    }
}



// Двери
materialDoorsState(Form.materialDoors);
systemDoorsState(Form.openingSystemDoors);
$('#doors [name=openingSystemDoors]').change((event) => systemDoorsState(event.target));
$('#doors [name=materialDoors]').change((event) => materialDoorsState(event.target))
$('#doors [name=add]').click(addNewTypeDoors);
$('#doors [name=remove]').click(removeThisTypeElem);
let indexDoors = 1;
let doorsTypes = ['doors'];
// Добавление нового типа дверей
function addNewTypeDoors() {
    const newDoors = $('#doors').clone(true, true)[0];
    const id = newDoors.id = newDoors.name = newDoors.id + indexDoors;
    indexDoors++;
    document.getElementById('doorsBlock').append(newDoors);
    $(`#${id} .title`)[0].innerHTML = `Двери ${indexDoors}`;
    const removeButton = newDoors.elements.remove;
    removeButton.style.display = 'block';
    const selectMaterial = newDoors.elements.openingSystemDoors;
    systemDoorsState(selectMaterial);
    materialDoorsState(selectMaterial);
    doorsTypes.push(id);
}
//Проверка состояния селекта материал
function materialDoorsState(select) {
    const doorsId = select.closest('fieldset').id;
    const selectText = select.selectedOptions[0].text;
    const miracleBlock = $(`#${doorsId} .miracleDoorsBlock`)[0];
    miracleBlock.style.display = selectText === 'Z-фасад' ? 'block' : 'none';
}
//Проверка состояния селекта система дверей
function systemDoorsState(select) {
    const doorsId = select.closest('fieldset').id;
    const selectText = select.selectedOptions[0].text;
    const doorsElements = Form.elements[doorsId].elements;

    $(`#${doorsId} .handlesDoorsBlock`).css({ "display": 'none' });
    doorsElements.countDoors.value = 2;
    doorsElements.heightDoors.value = Form.heightCupboard.value;
    doorsElements.widthDoors.value = Form.widthCompartment.value;
    doorsElements.widthDoors.maxLength = 3;

    switch (selectText) {
        case 'Распашные':
            doorsElements.countDoors.pattern = '[1-9]$|[1-9][0-9]';
            doorsElements.countDoors.nextElementSibling.innerHTML = 'От 1 до 99';
            doorsElements.widthDoors.pattern = "^4[5-9][0-9]$|^5[0-9][0-9]$|^6[0-4][0-9]$|650"
            doorsElements.widthDoors.nextElementSibling.innerHTML = 'От 450 до 650';
            $(`#${doorsId} .handlesDoorsBlock`).css({ "display": 'block' });
            break;
        case 'Wing Line':
            doorsElements.countDoors.pattern = '[2468]$|[1-9][02468]';
            doorsElements.countDoors.nextElementSibling.innerHTML = 'Только четные';
            doorsElements.widthDoors.pattern = "^3[5-9][0-9]$|[4-5][0-9][0-9]$|^6[0-4][0-9]$|650";
            doorsElements.widthDoors.nextElementSibling.innerHTML = 'От 350 до 650';
            break;
        case 'Modus OPK с профилем':
        case 'Modus OPK без профиля':
            doorsElements.countDoors.pattern = '[2-3]';
            doorsElements.countDoors.nextElementSibling.innerHTML = '2 или 3';
            doorsElements.widthDoors.pattern = "^4[5-9][0-9]$|^5[0-9][0-9]$|^6[0-4][0-9]$|650";
            doorsElements.widthDoors.nextElementSibling.innerHTML = 'От 450 до 650';
            break;
        default:
            doorsElements.widthDoors.maxLength = 4;
            doorsElements.countDoors.pattern = '[2-3]';
            doorsElements.countDoors.nextElementSibling.innerHTML = '2 или 3';
            doorsElements.widthDoors.pattern = "^3[5-9][0-9]$|[4-9][0-9][0-9]$|^1[0-1][0-9][0-9]$|1200";
            doorsElements.widthDoors.nextElementSibling.innerHTML = 'От 450 до 1200';
            break;
    }
}
// Расчёт
function createDoorsObject(id) {
    const doorElements = Form.elements[id].elements;
    const countDoors = +doorElements.countDoors.value; // Количество дверей первого типа
    const heightDoors = +doorElements.heightDoors.value; // Высота дверей первого типа
    const widthDoors = +doorElements.widthDoors.value; // Ширина дверей первого типа
    const squareDoors = countDoors * (heightDoors * widthDoors / 1000000); // Площадь дверей
    const perimeterDoors = (heightDoors * 2 + widthDoors * 2) / 1000; // Периметр дверей

    // Система открывания
    const openingSystem = doorElements.openingSystemDoors;
    const openingSystemName = openingSystem.selectedOptions[0].text;
    let openingSystemPrice = +openingSystem.value;
    switch (openingSystemName) {
        case 'Wing Line':
            openingSystemPrice = openingSystemPrice * (countDoors / 2);
            break;
        case 'Modus OPK без профиля':
            openingSystemPrice = countDoors === 2 ? 187 : 250;
            break;
        case 'Modus OPK с профилем':
            openingSystemPrice = countDoors === 2 ? 236 : 300;
            break;
        case 'Hettich Top Line L':
            openingSystemPrice = countDoors === 2 ? 275 : 330;
            break;
        case 'Hettich Top Line XL':
            openingSystemPrice = countDoors === 2 ? 405 : 550;
            break;
        default:
            openingSystemPrice = 0;
            break;
    }


    // Материал
    const materialDoors = doorElements.materialDoors.selectedOptions[0].text.trim();
    const priceMaterial = +doorElements.materialDoors.value;
    let priceMaterialDoors;
    let zFacade = {}
    if (materialDoors === 'Z-фасад') {
        // Z-профиль
        const priceZprofile = perimeterDoors * priceMaterial;
        zFacade.price = priceZprofile;

        // Уголки для фасада
        const countСorners = countDoors * 4;
        const priceСorners = countСorners * 0.5;
        zFacade.corners = {
            count: countСorners,
            price: priceСorners
        }

        // Сборка фасада
        const countAssemblyFacade = countDoors;
        const priceAssemblyFacade = countAssemblyFacade * 7;
        zFacade.assemblyFacad = {
            count: countAssemblyFacade,
            price: priceAssemblyFacade
        }

        // Зеркало
        const priceMiracleDoors = doorElements.miracleDoors.value * squareDoors;
        zFacade.mirror = {
            name: doorElements.miracleDoors.selectedOptions[0].text.trim(),
            price: priceMiracleDoors
        }

        priceMaterialDoors = priceZprofile + priceСorners + priceAssemblyFacade + priceMiracleDoors;
    } else {
        priceMaterialDoors = priceMaterial * squareDoors;
    }

    // Ручки
    const nameHandles = doorElements.handles.selectedOptions[0].text.trim();
    const countHandles = openingSystemPrice > 0 ? 0 : countDoors;
    const priceHandles = countHandles * doorElements.handles.value;

    // Выпрямители
    let countRectifier = materialDoors === 'Z-фасад' ? 0 : countDoors;
    if (openingSystemName !== 'Распашные' && openingSystemName !== 'Wing Line') {
        countRectifier *= 2;
    }
    const priceRectifier = countRectifier * 22;

    // Петли
    const countLoops = openingSystemPrice > 0 ? 0 : countDoors * 5;
    const priceLoops = countLoops * 2.5;

    // Фурнитура
    const priceFurnitureDoors = priceHandles + priceLoops + priceRectifier;

    const priceDoors = priceMaterialDoors + priceFurnitureDoors + openingSystemPrice;

    return {
        price: priceDoors,
        count: countDoors,
        height: heightDoors,
        width: widthDoors,
        openingSystem: {
            name: openingSystemName,
            price: openingSystemPrice,
        },
        square: squareDoors,
        perimeter: perimeterDoors,
        material: materialDoors,
        priceMaterial: priceMaterialDoors,
        zFacade: zFacade,
        furnitureDoors: {
            price: priceFurnitureDoors,
            handles: {
                name: nameHandles,
                count: countHandles,
                price: priceHandles
            },
            rectifier: {
                count: countRectifier,
                price: priceRectifier
            },
            loops: {
                count: countLoops,
                price: priceLoops
            }
        }
    }
}



// Дополнительные элементы
Form.addNewAdditionalElements.onclick = addNewAdditionalElementHandler;
function addNewAdditionalElementHandler() {
    const additionalElement = Form.additionalElements.value;
    createNewAdditionalElement(additionalElement);
}
function createNewAdditionalElement(element) {
    const newBlock = document.createElement('fieldset');
    newBlock.classList = ['row blockBorder'];
    newBlock.setAttribute('type', element);

    switch (element) {
        case 'antresol':
            getFormAntresol(newBlock);
            break;
        case 'builtinTumba':
            getFormBuiltinTumba(newBlock);
            break;
        case 'rail':
            getFormRail(newBlock);
            break;
        case 'metalStructures':
            getFormMetalStructures(newBlock);
            break;
        case 'mirror':
            getFormMirror(newBlock);
            break;
        case 'backlight':
            getFormBacklight(newBlock);
            break;
    }

    newBlock.insertAdjacentHTML('beforeend', '<!-- Кнопки --><div class="col-12 d-flex justify-content-center align-items-end"><button type="button" class="btn btn-danger btn-doors d-block" name="remove">-</button></div>');
    newBlock.elements.remove.onclick = (removeThisTypeElem);

    document.getElementById('additionalElementsBlock').append(newBlock);
}


// Антресоль
let indexAntresol = 1;
let antresolTypes = [];
function getFormAntresol(fieldset) {
    // Заголовок
    fieldset.name = fieldset.id = 'antresol' + indexAntresol; // Только для антресоли
    fieldset.innerHTML = `<h4>Антресоль ${indexAntresol}</h4>`// Только для антресоли
    indexAntresol++
    antresolTypes.push(fieldset.id)

    // Материал
    fieldset.insertAdjacentHTML('beforeend', '<!-- Материал дверей --><div class="col-md-5">Материал<select class="form-select" name="material"><option value="13" selected>ДСП</option><option value="55">MDF матовый прямой</option><option value="70">MDF глянец прямой</option><option value="90">MDF Фрез простой</option><option value="110">MDF Фрез средняя</option><option value="140">MDF Фрез сложный</option><option value="5.5">Z-фасад</option><option value="68">Акрил</option><option value="52">SupraMat</option><option value="135">Шаторсы</option><option value="110">Шпон</option><option value="41">AGT</option></select></div>')
    fieldset.elements.material.onchange = ((event) => materialState(event.target))

    // Зеркала
    fieldset.insertAdjacentHTML('beforeend', '<!-- Зеркало --><div class="col-md-5 miracleBlock">Зеркала<select class="form-select" name="miracle"><option value="10" selected>Cеребро</option><option value="10">Бронза</option><option value="15">Графит</option><option value="14">Лакобель</option></select></div>')

    // Количество
    fieldset.insertAdjacentHTML('beforeend', '<div class="col-12"></div><!-- Количество --><div class="col-md-3">Количество<input type="text" class="form-control" name="count" value="1" required maxlength="2" min="1" max="99" pattern = "[1-9]$|[1-9][0-9]" ><div class="invalid-feedback">от 1 до 99</div><div class="valid-feedback">Все хорошо!</div></div > ');

    // Высота
    fieldset.insertAdjacentHTML('beforeend', '<!-- Высота антресоли --><div class="col-md-3">Высота<input type="text" class="form-control" name="height" required maxlength="4" min="999" max="9999"pattern="[3-6][0-9][0-9]$|700"><div class="invalid-feedback">От 300 до 700</div><div class="valid-feedback">Все хорошо!</div></div>');

    // Ширина
    fieldset.insertAdjacentHTML('beforeend', '<!-- Ширина антресоли --><div class="col-md-3">Ширина<input type="text" class="form-control" name="width" required maxlength="3" min="450" max="650"pattern="^4[5-9][0-9]$|^5[0-9][0-9]$|^6[0-4][0-9]$|650"><div class="invalid-feedback">От 450 до 650</div><div class="valid-feedback">Все хорошо!</div></div>');

    // Количество фасадов
    fieldset.insertAdjacentHTML('beforeend', '<!-- Количество фасадов --><div class="col-md-3 p-md-0">Количество фасадов<input type="text" class="form-control" name="countFacade" value="1" required maxlength="2" min="1" max="99"pattern="[1-9]$|[1-9][0-9]"><div class="invalid-feedback">от 1 до 99</div><div class="valid-feedback">Все хорошо!</div></div>');
}
// Расчёт
function createAntresolObject(id) {
    const antresolElements = Form.elements[id].elements;

    const countAntresol = +antresolElements.count.value; // Количество
    const heightAntresol = +antresolElements.height.value; // Высота
    const widthAntresol = +antresolElements.width.value; // Ширина
    const countFacadeAntresol = +antresolElements.countFacade.value; // Количество фасадов
    const perimeterFacadeAntresol = ((heightAntresol + widthAntresol) * 2) / 1000; // Периметр фасадов
    const squareFacadeAntresol = (heightAntresol * widthAntresol / 1000000); // Площадь фасадов
    const materialAntresolName = antresolElements.material.selectedOptions[0].text; // Название материала
    const materialAntresolPrice = antresolElements.material.value; // Цена материала
    const miracleAntresolName = antresolElements.miracle.selectedOptions[0].text; // Цена материала
    const miracleAntresolPrice = antresolElements.material.value; // Цена материала


    let facade = {
        name: materialAntresolName,
        count: countFacadeAntresol,
        perimeter: perimeterFacadeAntresol,
        square: squareFacadeAntresol,
    };

    let priceFacade;
    if (materialAntresolName === 'Z-фасад') {
        // Z-профиль
        const priceZprofile = perimeterFacadeAntresol * materialAntresolPrice;
        facade.priceZprofile = priceZprofile;

        // Уголки для фасада
        const countСorners = countFacadeAntresol * 4;
        const priceСorners = countСorners * 0.5;
        facade.corners = {
            count: countСorners,
            price: priceСorners
        }

        // Сборка фасада
        const priceAssemblyFacade = countFacadeAntresol * 7;
        facade.assemblyFacad = {
            count: countFacadeAntresol,
            price: priceAssemblyFacade
        }

        // Зеркало
        const priceMiracle = miracleAntresolPrice * squareFacadeAntresol;
        facade.miracle = miracleAntresolName;
        facade.priceMiracle = priceMiracle;

        priceFacade = priceZprofile + priceСorners + priceAssemblyFacade + priceMiracle;
        debugger
    } else {
        priceFacade = materialAntresolPrice * squareFacadeAntresol;
    }
    facade.price = priceFacade;

    const priceFurniture = (countFacadeAntresol * 10);
    const priceBodyAntresol = (countAntresol * 23);

    const price = priceBodyAntresol + priceFurniture + priceFacade; // Цена за антресоли

    return {
        price: price,
        count: countAntresol,
        height: heightAntresol,
        width: widthAntresol,
        priceBody: priceBodyAntresol,
        facade: facade,
        priceFurniture: priceFurniture,
    };
}
//Проверка состояния селекта материал
function materialState(select) {
    const blockId = select.closest('fieldset').id;
    const selectText = select.selectedOptions[0].text;
    const miracleBlock = $(`#${blockId} .miracleBlock`)[0];
    miracleBlock.style.display = selectText === 'Z-фасад' ? 'block' : 'none';
}


// Встроенная тумба
let indexBuiltinTumba = 1;
let builtinTumbaTypes = [];
function getFormBuiltinTumba(fieldset) {
    // Заголовок
    fieldset.name = fieldset.id = 'builtinTumba' + indexBuiltinTumba; // Только для антресоли
    fieldset.innerHTML = `<h4>Встроенная тумба ${indexBuiltinTumba}</h4>`// Только для антресоли
    builtinTumbaTypes.push(fieldset.id)
    indexBuiltinTumba++

    fieldset.insertAdjacentHTML('beforeend', '<!-- Материал фасадов --><div class="col-md-6">Материал<select class="form-select" name="material"><option value="13" selected>ДСП</option><option value="55">MDF матовый прямой</option><option value="70">MDF глянец прямой</option><option value="90">MDF Фрез простой</option><option value="110">MDF Фрез средняя</option><option value="140">MDF Фрез сложный</option><option value="68">Акрил</option><option value="52">SupraMat</option><option value="135">Шаторсы</option><option value="110">Шпон</option><option value="41">AGT</option></select></div>');

    fieldset.insertAdjacentHTML('beforeend', '<!-- Навесная --><div class="col-md-3 d-flex align-items-center form-check"><input class="form-check-input mx-2" type="checkbox" name="plunging">Навесная</div>');

    fieldset.insertAdjacentHTML('beforeend', '<div class="col-12"></div><!-- Количетсво --><div class="col-md-3">Количество<input type="text" class="form-control" name="count" value="1" required maxlength="2"min="1" max="99" pattern="[1-9]$|[1-9][0-9]"><div class=" invalid-feedback">от 1 до 99</div><div class="valid-feedback">Все хорошо!</div></div>');

    fieldset.insertAdjacentHTML('beforeend', '<!-- Высота --><div class="col-md-3">Высота<input type="text" class="form-control" name="height" required maxlength="4"pattern="$|[1-5][0-9][0-9]$|600"><div class="invalid-feedback">от 100 до 600</div><div class="valid-feedback">Все хорошо!</div></div>');

    fieldset.insertAdjacentHTML('beforeend', '<!-- Ширина --><div class="col-md-3">Ширина<input type="text" class="form-control" name="width" required maxlength="4"pattern="$|^4[5-9][0-9]$|[5-9][0-9][0-9]$|1000"><div class="invalid-feedback">от 450 до 1000</div><div class="valid-feedback">Все хорошо!</div></div>');

    fieldset.insertAdjacentHTML('beforeend', '<!-- Система открывания --><div class="col-md-6">Система открывания<select class="form-select" name="openingSystem"><option value="15" selected>Распашные</option><option value="12">Распашные с tipon</option><option value="28">Шариковые шуфляды</option><option value="37">Tandem шуфляды</option><option value="44">Tandem шуфляды с tipon</option></select></div>');

    fieldset.insertAdjacentHTML('beforeend', '<!-- Количество дверей --><div class="col-md-3 text">Количество дверей<input type="text" class="form-control" name="countDoors" value="1" required maxlength="2"min="1" max="99" pattern="[1-9]$|[1-9][0-9]"><div class=" invalid-feedback">от 1 до 99</div><div class="valid-feedback">Все хорошо!</div></div>');

}
function createBuiltinTumbaObject(id) {
    const elements = Form.elements[id].elements;

    const count = +elements.count.value; // Количество
    const countDoors = +elements.countDoors.value; // Количество дверей
    const height = +elements.height.value; // Высота
    const width = +elements.width.value; // Ширина
    const perimeterFacade = ((height + width) * 2) / 1000; // Периметр фасадов
    const squareFacade = (height * width / 1000000); // Площадь фасадов
    const materialName = elements.material.selectedOptions[0].text; // Название материала
    const materialPrice = elements.material.value; // Цена материала
    const openingSystemName = elements.openingSystem.selectedOptions[0].text; // Система открывания
    const openingSystemPrice = elements.openingSystem.value * countDoors; // Цена система открывания
    const plunging = elements.plunging.checked;


    let priceBody = count * (((width - 450) / (1000 - 450)) * (50 - 25) + 25);
    if (plunging) {
        priceBody += (width / 1000) * 10;
    }
    if (count > 3 && count % 2 === 0) {
        priceBody += count / 2 * 13;
    }

    priceBody = Math.round(priceBody);

    const priceFacade = squareFacade * materialPrice;

    return {
        price: Math.round(priceBody + priceFacade + openingSystemPrice),
        count: count,
        height: height,
        width: width,
        perimeterFacade: perimeterFacade,
        squareFacade: squareFacade,
        plunging: plunging,
        priceBody: priceBody,
        countDoors: countDoors,
        facade: {
            name: materialName,
            price: priceFacade,
        },
        openingSystem: {
            name: openingSystemName,
            price: openingSystemPrice,
        },
    }
}

// Рейки
let indexRail = 1;
let railTypes = [];
function getFormRail(fieldset) {
    // Заголовок
    fieldset.name = fieldset.id = 'rail' + indexRail; // Только для антресоли
    fieldset.innerHTML = `<h4>Рейки ${indexRail}</h4>`// Только для антресоли
    railTypes.push(fieldset.id)
    indexRail++
    fieldset.insertAdjacentHTML('beforeend', '<!-- Длина --><div class="col-md-3">Длина<input type="text" class="form-control" name="lengthRail" value="90" required maxlength="5" pattern="^9[0-9]$|[1-9][0-9][0-9]$|[1-9][0-9][0-9][0-9]$|[1-9][0-9][0-9][0-9][0-9]"><div class="invalid-feedback">от 90 до 99999</div><div class="valid-feedback">Все хорошо!</div></div>');
}
function createRailObject(id) {
    const elements = Form.elements[id].elements;
    const lengthRail = +elements.lengthRail.value;
    const price = Math.floor(lengthRail / 90) * 6;
    return {
        length: lengthRail,
        price: price,
    };
}

// Металлоконструкция
let indexmetalStructures = 1;
let metalStructuresTypes = [];
function getFormMetalStructures(fieldset) {
    // Заголовок
    fieldset.name = fieldset.id = 'metalStructures' + indexmetalStructures; // Только для антресоли
    fieldset.innerHTML = `<h4>Металлоконструкция ${indexmetalStructures}</h4>`// Только для антресоли
    metalStructuresTypes.push(fieldset.id)
    indexmetalStructures++
    fieldset.insertAdjacentHTML('beforeend', '<!-- Длина --><div class="col-md-3">Длина<input type="text" class="form-control" name="lengthMetalStructures" value="1000" required maxlength="5" pattern="^9[0-9]$|[1-9][0-9][0-9]$|[1-9][0-9][0-9][0-9]$|[1-9][0-9][0-9][0-9][0-9]"><div class="invalid-feedback">от 90 до 99999</div><div class="valid-feedback">Все хорошо!</div></div>');
}
function createMetalStructuresObject(id) {
    const elements = Form.elements[id].elements;
    const lengthMetalStructures = +elements.lengthMetalStructures.value;
    const price = ((lengthMetalStructures / 1000) * 8) + 15;

    return {
        length: lengthMetalStructures,
        price: price,
    };
}

// Зеркало
let indexMirror = 1;
let mirrorTypes = [];
function getFormMirror(fieldset) {
    // Заголовок
    fieldset.name = fieldset.id = 'mirror' + indexMirror;
    fieldset.innerHTML = `<h4>Зеркало ${indexMirror}</h4>`
    mirrorTypes.push(fieldset.id)
    indexMirror++

    fieldset.insertAdjacentHTML('beforeend', '<!-- Количество --><div class="col-md-3">Количество<input type="text" class="form-control" name="count" value="1" required maxlength="2" pattern="[1-9]$|[1-9][0-9]"><div class="invalid-feedback">от 1 до 99</div><div class="valid-feedback">Все хорошо!</div></div>');

    fieldset.insertAdjacentHTML('beforeend', '<!-- Высота --><div class="col-md-3">Высота<input type="text" class="form-control" name="height" required maxlength="4"pattern="[1-9][0-9]$|[1-9][0-9][0-9]$|[1-2][0-7][0-9][0-9]$|2800"><div class="invalid-feedback">от 10 до 2800</div><div class="valid-feedback">Все хорошо!</div></div>');

    fieldset.insertAdjacentHTML('beforeend', '<!-- Ширина --><div class="col-md-3">Ширина<input type="text" class="form-control" name="width" required maxlength="4"pattern="[1-9][0-9]$|[1-9][0-9][0-9]$|[1-2][0-7][0-9][0-9]$|2800"><div class="invalid-feedback">от 10 до 2800</div><div class="valid-feedback">Все хорошо!</div></div>');

    fieldset.insertAdjacentHTML('beforeend', '<!-- Зеркало --><div class="col-md-5">Тип<select class="form-select" name="material"><option value="10" selected>Cеребро</option><option value="10">Бронза</option><option value="15">Графит</option></select></div>');
}
function createMirrorObject(id) {
    const elements = Form.elements[id].elements;

    const count = +elements.count.value; // Количество
    const height = +elements.height.value; // Высота
    const width = +elements.width.value; // Ширина
    const square = (height * width / 1000000); // Площадь
    const materialName = elements.material.selectedOptions[0].text; // Название материала
    const materialPrice = elements.material.value; // Цена материала
    const price = count * (square * materialPrice) + 15;
    return {
        name: materialName,
        square: square,
        price: price
    }
}

// Подсветка
let indexBacklight = 1;
let backlightTypes = [];
function getFormBacklight(fieldset) {
    // Заголовок
    fieldset.name = fieldset.id = 'backlight' + indexBacklight; // Только для антресоли
    fieldset.innerHTML = `<h4>Подсветка ${indexBacklight}</h4>`// Только для антресоли
    backlightTypes.push(fieldset.id)
    indexBacklight++
    fieldset.insertAdjacentHTML('beforeend', '<!-- Длина --><div class="col-md-3">Длина в метрах<input type="text" class="form-control" name="lengthBacklight" value="1" required maxlength="5" pattern="[1-9]$|[1-9][0-9]"><div class="invalid-feedback">от 1 до 99</div><div class="valid-feedback">Все хорошо!</div></div>');
}
function createBacklightObject(id) {
    const elements = Form.elements[id].elements;
    const lengthBacklight = +elements.lengthBacklight.value;
    const price = lengthBacklight <= 5 ? 70 : ((lengthBacklight - 5) * 5) + 70;
    return {
        length: lengthBacklight,
        price: price,
    };
}


Form.addEventListener('submit', (event) => {
    event.preventDefault()
    Form.classList.add('was-validated');
    if (!Form.checkValidity()) return;

    // КОРПУС
    //Отсеки
    const countCompartment = +Form.countCompartment.value; // Количество отсеков
    // const extraСhargeDepth = +Form.depthCupboard.value > 600 ? countCompartment * 35 : 0;
    const priceMaterilaCompartment = countCompartment * (((+Form.widthCompartment.value - 450) / (1000 - 450)) * (72 - 65) + 65); // Отсеки

    // Ножки
    const countSupportCupboard = (countCompartment * 2 + 2);
    const priceSupportCupboard = countSupportCupboard * 3.5;

    // Полки
    const countShelf = +Form.countShelf.value // Меняй
    const priceShelf = countShelf * 3;

    // Стойки
    const countSeparation = +Form.countSeparation.value; // Меняй
    const priceSeparation = countSeparation * 7;

    // Фурнитура для фасадов антресолей
    const countFacadeAndresol = +Form.countFacadeAndresol.value; // Меняй
    const priceFacadeAndresol = countFacadeAndresol * 10;

    // Шариковые ящики
    const countRollonDrawer = +Form.countRollonDrawer.value; // Меняй
    const priceRollonDrawer = countRollonDrawer * 28;

    // Tandem ящики
    const countTandemDrawer = +Form.countTandemDrawer.value; // Меняй
    const priceTandemDrawer = countTandemDrawer * 37;

    const priceCompartment = priceMaterilaCompartment + priceSupportCupboard + priceShelf + priceSeparation + priceFacadeAndresol + priceRollonDrawer + priceTandemDrawer;

    let cupboard = {
        price: Math.ceil(priceCompartment),
        priceBody: priceCompartment,
        loginInstagram: Form.loginInstagram.value,
        width: Form.widthCupboard.value,
        height: Form.heightCupboard.value,
        depth: Form.depthCupboard.value,
        doors: [],
        antresol: [],
        builtinTumba: [],
        rail: [],
        metalStructures: [],
        mirror: [],
        backlight: [],
        compartments: {
            width: Form.widthCompartment.value,
            count: Form.countCompartment.value,
            price: priceMaterilaCompartment,
        },
        support: {
            count: countSupportCupboard,
            price: priceSupportCupboard
        },
        shelfs: {
            count: countShelf,
            price: priceShelf
        },
        separation: {
            count: countSeparation,
            price: priceSeparation
        },
        facadeAndresol: {
            count: countFacadeAndresol,
            price: priceFacadeAndresol
        },
        rollonDrawer: {
            count: countRollonDrawer,
            price: priceRollonDrawer
        },
        tandemDrawer: {
            count: countTandemDrawer,
            price: priceTandemDrawer
        }
    };

    doorsTypes.forEach((value) => {
        const newDoors = createDoorsObject(value);
        cupboard.price += newDoors.price;
        cupboard.doors.push(newDoors);
    })

    antresolTypes.forEach((value) => {
        const newAntresol = createAntresolObject(value);
        cupboard.price += newAntresol.price;
        cupboard.antresol.push(newAntresol);
    })

    builtinTumbaTypes.forEach((value) => {
        const newBuiltinTumba = createBuiltinTumbaObject(value);
        cupboard.price += newBuiltinTumba.price;
        cupboard.builtinTumba.push(newBuiltinTumba);
    })

    railTypes.forEach((value) => {
        const newRail = createRailObject(value);
        cupboard.price += newRail.price;
        cupboard.rail.push(newRail);
    })

    metalStructuresTypes.forEach((value) => {
        const newMetalStructures = createMetalStructuresObject(value);
        cupboard.price += newMetalStructures.price;
        cupboard.metalStructures.push(newMetalStructures);
    })

    mirrorTypes.forEach((value) => {
        const newMirror = createMirrorObject(value);
        cupboard.price += newMirror.price;
        cupboard.mirror.push(newMirror);
    })

    backlightTypes.forEach((value) => {
        const newBacklight = createBacklightObject(value);
        cupboard.price += newBacklight.price;
        cupboard.backlight.push(newBacklight);
    })

    cupboard.price = Math.ceil(cupboard.price);

    // Отправка
    let xhr = new XMLHttpRequest();
    let url = "../php/form.php";
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            PriceCupboard.innerHTML = this.responseText;
        }
    };
    cupboard = JSON.stringify(cupboard);
    xhr.send(cupboard);


    event.preventDefault;
    return false;
})