
switch(step.type){

    case "navigate":
        return <NavigateEditor .../>

    case "collect":
        return <CollectEditor .../>

    case "loop":
        return <LoopEditor .../>

    case "action":
        return <ActionEditor .../>

    case "wait":
        return <WaitEditor .../>

    case "condition":
        return <ConditionEditor .../>

}