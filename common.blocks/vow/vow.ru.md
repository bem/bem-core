# vow

Блок служит для подключения библиотеки [Vow](https://github.com/dfilatov/vow). 

Vow – библиотека для работы с промисами, реализующая стандарт [Promises/A+](http://promisesaplus.com/) и поддержку спецификации [ES6 Promises](https://people.mozilla.org/~jorendorff/es6-draft.html#sec-promise-objects).

Блок `vow` реализован в технологии `vanila.js` и подходит для использования как на клиенте, так и на сервере.

## Использование

### Создание промиса
Есть два возможных пути создания промиса:

#### 1. С помощью deferred

```js
function doSomethingAsync() {
    var deferred = vow.defer();
    
    // теперь можно воспользоваться методами resolve, reject и notify 
    // для изменения состояний `deferred`. 
    // Например, `defered.resolve('ok');`
        
    return deferred.promise(); // затем возвращаем promise, чтобы предоставить возможность подписки
}

doSomethingAsync().then(
    function() {}, // реакция на успешное разрешение (resolve)
    function() {}, // реакция на разрешение отказом (reject)
    function() {}  // реакция на изменение состояния (notify)
);
```


Разница между `deferred` и `promise` состоит в том, что, `deferred` имеет методы для изменения состояний промиса – разрешения, отказа и успеха, тогда как промис позволяет лишь подписаться на эти состояния.

Создадим блок, выполняющий некоторое асинхронное действие. Для наглядности воспользуемся методом `setTimeout` со случайной задержкой: 

```js
modules.require(['vow'], function(vow) {
    var a = [1, 2, 3, 4, 5], 
    // массив значений
        _doAsync = function(val) {
            // создаем случайную задержку в диапазоне от 0 до 3 сек
            var delay = Math.round(Math.random() * 3000), 
                defered = vow.defer();

            // вызываем setTimeout со случайной задержкой и вызываем defered.resolve по ее истечению
            setTimeout(function() { defered.resolve(val + ' delay was ' + delay); }, delay);
            
            // возвращаем промис, чтобы предоставить возможность подписки
            return defered.promise();
        };

    for(var i = 0; i < a.length; i += 1){
        // вызываем в цикле _doAsync для каждого элемента массива a 
        _doAsync(a[i]) 
            // задаем реакцию на успешное разрешение промиса
            .then(function(val) { console.log(val); });
    };
});
```


Несмотря на то, что `_doAsync` внутри цикла вызывалась синхронно, callback-функция для состояния resolve будет вызвана только после истечения задержки для соответствующего промиса.   

#### 2. Совместимый с ES6 путь 

```js
function doSomethingAsync() {
    return new vow.Promise(function(resolve, reject, notify) {
        // теперь можно устанавливать состояния resolve, reject, notify для промиса
    });
}

doSomethingAsync().then(
    function() {}, // реакция на успешное разрешение (resolve)
    function() {}, // реакция на разрешение отказом (reject)
    function() {}  // реакция на изменение состояния (notify)
);
```


При использовании пути, совместимого с ES6, приведенный выше пример с задержками будет выглядеть следующим образом:

```js
modules.require(['vow'], function(vow) {
    var a = [1, 2, 3, 4, 5], 
    // массив значений
        _doAsync = function(val) {
            // создаем случайную задержку в диапазоне от 0 до 3 сек
            var delay = Math.round(Math.random() * 3000); 

            // возвращаем промис, чтобы предоставить возможность подписки
            return new vow.Promise(function(resolve, reject, notify) { 
                // вызываем setTimeout со случайной задержкой и разрешаем промис по ее истечению
                setTimeout(function() { resolve(val + ' delay was ' + delay); }, delay); 
            });  
        };

    for(var i = 0; i < a.length; i += 1){
        // вызываем в цикле _doAsync для каждого элемента массива a 
        _doAsync(a[i]) 
            // задаем реакцию на успешное разрешение промиса
            .then(function(val) { console.log(val); });
    };
});
```


С полным API библиотеки вы можете ознакомиться здесь http://dfilatov.github.io/vow/.
