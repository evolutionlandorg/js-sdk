A javascript library for interact with blockchain(Ethereum、Tron) and Evolution Land.

## Usage
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8"/>
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <meta http-equiv="X-UA-Compatible" content="ie=edge"/>
    <title>Document</title>
</head>
<body>
<script src="../dist/evolutionland.min.js"></script>
<script>
    const evo = new Evolution();

    await evo.createWeb3js()

    // await evo.createTronweb()
    // await evo.createEvolutionLand('tron', 'main');

    // await evo.createEvolutionLand('crab', 'pangolin');
    // const evolandInstance = evo.crabEvoland
    
    await evo.createEvolutionLand('ethereum', 'ropsten');
    const evolandInstance = evo.ethEvoland

    evo.ethEvoland.buyRing(10000)
</script>
</body>
</html>

```
