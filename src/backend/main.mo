import Text "mo:core/Text";
import List "mo:core/List";
import Runtime "mo:core/Runtime";
import Iter "mo:core/Iter";

actor {
  type Product = {
    #g100;
    #g250;
    #g500;
  };

  module Product {
    let productMap = [
      ("100g", #g100 : Product),
      ("250g", #g250 : Product),
      ("500g", #g500 : Product),
    ];

    public func fromText(productText : Text) : Product {
      switch (productMap.find(func((text, _)) { Text.equal(text, productText) })) {
        case (null) {
          Runtime.trap("No product found for provided text: " # debug_show (productText));
        };
        case (?(text, product)) { product };
      };
    };
  };

  type Inquiry = {
    name : Text;
    email : Text;
    phone : Text;
    product : Product;
    message : ?Text;
  };

  let inquiries = List.empty<Inquiry>();
  var visitCounter = 0;

  public shared ({ caller }) func submitInquiry(name : Text, email : Text, phone : Text, productText : Text, message : ?Text) : async () {
    let product = Product.fromText(productText);
    let newInquiry : Inquiry = {
      name;
      email;
      phone;
      product;
      message;
    };
    inquiries.add(newInquiry);
  };

  public shared ({ caller }) func incrementVisitCounter() : async Nat {
    visitCounter += 1;
    visitCounter;
  };

  public query ({ caller }) func getAllInquiries() : async [Inquiry] {
    let iter = inquiries.values();
    iter.toArray();
  };

  public query ({ caller }) func getVisitCounter() : async Nat {
    visitCounter;
  };
};
