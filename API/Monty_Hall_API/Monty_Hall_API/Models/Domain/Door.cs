using System.ComponentModel.DataAnnotations;

namespace Monty_Hall_API.Models.Domain
{
    public class Door
    {
        public Guid Id { get; set; }
        //public string Name { get; set; }
        public bool IsCar { get; set; }
        public bool IsSelected { get; set; }
        public bool IsOpen { get; set; }

        //public Door(Guid id, string doorName, bool isCar) {
        //    Id = id;
        //    Name = doorName;
        //    IsCar = isCar;
        //    IsSelected = false;
        //    IsOpen = false;
        //}
    }
}
