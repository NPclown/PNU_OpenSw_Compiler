public class Square extends Shape{
 
    public Square(String name, int r){
        super(name, r);
    }
     
    @Override
    public void area(){
        area= (r*r);
        System.out.println("radius : "+r + "name : " + name);
        System.out.println(name+"area is : "+area);
    }
}


