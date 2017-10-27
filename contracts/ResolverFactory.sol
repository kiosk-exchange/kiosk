pragma solidity ^0.4.11;

import "./DINRegistry.sol";
import "./StandardResolver.sol";

/** @title Resolver factory. Creates new resolver contracts */
contract ResolverFactory {

    DINRegistry public registry;

    // Logged when a new resolver contract is created.
    event NewResolver(address indexed resolver, string productURL, address indexed merchant);

    function ResolverFactory(DINRegistry _registry) {
        registry = _registry;
    }

    function newResolver(string productURL, address merchant) {
        StandardResolver resolver = new StandardResolver(registry, productURL, merchant);
        NewResolver(resolver, productURL, merchant);
    }

}